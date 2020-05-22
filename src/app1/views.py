from __future__ import unicode_literals
from django.shortcuts import render, get_object_or_404
from djoser.conf import settings as dj_settings
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from .models import *
import json
from django.forms.models import model_to_dict
from .serializers import *
from rest_framework import generics
from django.core import serializers
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import CsrfViewMiddleware, get_token
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.decorators import login_required, permission_required
from rest_framework.permissions import IsAuthenticated
import datetime


class User_Delete(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):

        if request.method == "POST":
            if dj_settings.TOKEN_MODEL:
                dj_settings.TOKEN_MODEL.objects.filter(
                    user__email=request.POST.get("email")
                ).delete()
            User.objects.get(email=request.POST.get("email")).delete()
        return HttpResponse("")


def login(request):
    return render(request, "index.html")


""" View to Display all transactions irrespective of Bill """


class TransactionListView(generics.ListAPIView):
    queryset = Product_Transaction.objects.all()
    serializer_class = TransactionSerializer


""" View to Display all Bills """


class BillListView(generics.ListAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer


""" View to Display all Products """


class ProductListView(generics.ListCreateAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductListSerializer


""" View to Delete specific product from database using product id """


class ProductDeleteView(generics.DestroyAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductListSerializer


""" View to Update attributes of a specific product from database using product id (pid) """


class Product_Update(generics.GenericAPIView):
    def post(self, request, pid, *args, **kwargs):
        """ Parameters
            ------------
            product id(pid)
            (POST) from user: name , latest selling price and loose (Boolean Value)
            ------------

            Here, user can change name of product, its latest selling price and make the product loose or not loose(packaged)

            For name change, we get the product using its id, store its name in a variable pname and then change product's name
            as requested by user
            Similarly, latest selling price of the product is directly updated.

            For loose, if loose attriibute remains unchanged, then no changes occur
            However, if loose product is to be made packaged, i.e. loose = False, Items of that particular product are added in the
            database according to product quantity.
            If packaged product is to be made loose, items of that particular product are deleted from database.
            addition and deletion of items is done using the pname variable which stored earlier product name.        """

        if request.method == "POST":
            try:
                pr = Products.objects.get(id=pid)
                pname = pr.name

                # change product name
                if (
                    request.POST["name"] != None
                    or request.POST["name"].isspace() != True
                ):
                    pr.name = request.POST["name"]

                    # change latest selling price
                    pr.latest_selling_price = request.POST["latest_selling_price"]

                    pr.upper_limit = request.POST["upper"]
                    pr.lower_limit = request.POST["lower"]

                    # check if changes are made to loose attribute and add/ delete items accordingly
                    if pr.loose == True and (request.POST["loose"]) == "False":

                        for i in range(1, int(pr.quantity) + 1):
                            itobj = Items(product=pr)
                            itobj.save()

                        pr.loose = False
                    elif pr.loose == False and (request.POST["loose"] == "True"):
                        ito = Items.objects.filter(product__name=pname)
                        for i in ito:
                            i.delete()

                        pr.loose = True
                    else:
                        pr.loose = request.POST["loose"]

                    # save and update
                    pr.save()

                    # serialize and return updated response
                    dict_obj = model_to_dict(pr)
                    serialized = json.dumps(dict_obj)
                    return HttpResponse(serialized)

                else:
                    res = HttpResponse("Incorrect Name Input")
                    res.status_code = 400
                    return res
            except Products.DoesNotExist:

                res = HttpResponse("Product Does not exist")
                res.status_code = 404
                return res


"""  View to buy Products """


class Buy(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        """ Parameters
                ------------
            (POST) from user: name , avg_cost_price and quantity;
                ------------

                Here, user buys a product. It might be a new product or an existing product. This counts for all IN Transactions.

                We search for a product using its name.

                If a Product already exists,
                Then we recalculate avg_cost_pice of the product using the formula:

                new avg_cost_price = (current avg_cost_price*current no. of items) + (POSTed avg_cost_price* POSTed no. of items)
                                    -----------------------------------------------------------------------------------------------
                                                            current no. of items + POSTed no. of items

                Then we increase the quantity of the product and
                Then we check if product is loose or not, if not then we add new items of said product to the database accordingly.
                We save the In transaction.

                If Product doesn't exist, we create a new product using above paramenters keeping deafult value for loose(False) and
                latest_selling_price (null) and save the transaction.

                If we create a new product, we set the variable created to True and send it along with the response, else it is set to False
                and then sent

            """

        if request.method == "POST":
            if request.POST["name"] == "" or request.POST["name"].isspace() == True:
                res = HttpResponse("Incorrect Name Input")
                res.status_code = 400
                return res
            else:
                try:
                    # If Product exists

                    re = Products.objects.get(name=request.POST["name"])

                    # Re Calculate avg_cost_price
                    re.avg_cost_price = (
                        (re.avg_cost_price * re.quantity)
                        + (
                            int(request.POST["avg_cost_price"])
                            * int(request.POST["quantity"])
                        )
                    ) / (int(request.POST["quantity"]) + re.quantity)

                    # Increase quantity
                    re.quantity = re.quantity + int(request.POST["quantity"])
                    re.save()

                    # If product is not loose, add items to database
                    if re.loose == False:

                        for i in range(1, int(request.POST["quantity"]) + 1):
                            itobj = Items(product=re, expiry=request.POST['expiry'])
                            itobj.save()

                    # Save IN Transaction
                    trobj = Product_Transaction(
                        product=re,
                        quantity=int(request.POST["quantity"]),
                        rate=int(request.POST["avg_cost_price"]),
                        in_or_out="In",
                    )
                    trobj.save()

                    # Send response with created = False
                    tr = Products.objects.get(name=request.POST["name"])
                    created = {"created": False}
                    dict_obj = model_to_dict(tr)
                    dict_obj.update(created)
                    serialized = json.dumps(dict_obj)
                    return HttpResponse(serialized)

                except Products.DoesNotExist:
                    # If Product does not exist already:
                    name = request.POST["name"]
                    quant = request.POST["quantity"]

                    avg_cost_price = request.POST["avg_cost_price"]

                    pdt = Products(
                        name=name, quantity=quant, avg_cost_price=avg_cost_price
                    )
                    # Created new product
                    pdt.save()
                    # Added Items as default loose= False
                    for i in range(1, int(request.POST["quantity"]) + 1):
                        itobj = Items(product=pdt, expiry=request.POST['expiry'])
                        itobj.save()

                    # Save Transaction
                    trobj = Product_Transaction(
                        product=pdt,
                        quantity=int(request.POST["quantity"]),
                        rate=int(request.POST["avg_cost_price"]),
                        in_or_out="In",
                    )
                    trobj.save()

                    # Send Response with created = True
                    tr = Products.objects.get(name=request.POST["name"])
                    created = {"created": True}
                    dict_obj = model_to_dict(tr)
                    dict_obj.update(created)
                    serialized = json.dumps(dict_obj)

                    return HttpResponse(serialized)


""" View to sell products """


class Sell(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        """ Parameters
            ------------
        (POST) from user: name , latest_selling_price and quantity;
            ------------

            Here, user sells a product. It must be an existing product. This counts for all OUT Transactions.

            We search for a product using its name.

            If a Product does not exist, 404 error is generated

            After finding the product, product quantity is deducted by the required quantity only if there is enough quantity
            of the product available for selling

            If product is loose, new latest_selling_price of product is saved as given by user;

            else it is not saved as for packaged goods, latest_selling_price is MRP.

            If product is packaged, number of items equal to those sold are deleted from database.

            Transaction is then saved as an OUT transaction and suitable response is returned            """

        if request.method == "POST":
            # Retrieve object if it exisits or generate 404
            try:
                re = Products.objects.get(name=request.POST["name"])

                # Check if enough quantity of product is available for selling
                if re.quantity - int(request.POST["quantity"]) >= 0:
                    # Update product quantity
                    re.quantity = re.quantity - int(request.POST["quantity"])
                    # If product is loose, update latest_selling_price
                    if re.loose == True:
                        re.latest_selling_price = request.POST["latest_selling_price"]
                    re.save()
                else:
                    res = HttpResponse("Not enough items available")
                    res.status_code = 400
                    return res

                # Save OUT Transaction
                trobj = Product_Transaction(
                    product=re,
                    quantity=int(request.POST["quantity"]),
                    rate=request.POST["latest_selling_price"],
                    in_or_out="Out",
                )
                trobj.save()

                # If item is packaged. delete required amount of items from database
                if re.loose == False:
                    it = Items.objects.filter(product__name=re.name)
                    for i in range(0, int(request.POST["quantity"])):
                        it[i].delete()

                # Send Required Response
                tr = Products.objects.get(name=request.POST["name"])
                created = {"created": False}
                dict_obj = model_to_dict(tr)
                dict_obj.update(created)
                serialized = json.dumps(dict_obj)
                return HttpResponse(serialized)

            except Products.DoesNotExist:
                res = HttpResponse("Product Does not exist")
                res.status_code = 404
                return res


class Profit(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated() == True:
            serializer_class = ProfitSerializer
            products = Products.objects.all()
            result = {}
            # final_profit = {}

            for i in products:
                product_profit = Product_Transaction.objects.filter(product=i)
                for j in product_profit:
                    month = str(j.date.strftime("%Y-%m"))
                    result[month] = 0

                result["Total"] = 0
                cp_total = 0
                q_cp_total = 0
                sp_total = 0
                q_sp_total = 0
                for m in result:
                    if m != "Total":
                        profit_product_monthly = product_profit.filter(
                            date_year=m.split("-")[0], date_month=m.split("-")[1]
                        )
                        cp = 0
                        q_cp = 0
                        sp = 0
                        q_sp = 0
                        for transaction in profit_product_monthly:
                            if transaction.in_or_out == "In":
                                cp = cp + transaction.quantity * transaction.rate
                                q_cp += transaction.quantity
                            else:
                                sp = sp + transaction.quantity * transaction.rate
                                q_sp += transaction.quantity
                        if q_cp and q_sp:
                            result[m] = {
                                "earned": sp,
                                "spent": cp,
                                "sold": q_sp,
                                "bought": q_cp,
                            }  # total earned and spent, and total items bought and sold every month
                            cp_total += cp
                            sp_total += sp
                            q_cp_total += q_cp
                            q_sp_total += q_sp
            result["Total"] = {
                "earned": sp_total,
                "sold": q_sp_total,
                "spent": cp_total,
                "bought": q_cp_total,
            }
        else:
            res = HttpResponse("Unauthorized")
            res.status_code = 401
            return res


class Expiry(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):

        pr = Products.objects.all()
        exp = []
        for p in pr:
            i = p.items_set.all()
            d = i[0].expiry
            d1 = i.filter(expiry=d)
            d2 = len(d1)
            d3 = ((d - datetime.date.today()).days)
            if(d3 <= 3):
                p2 = {"Product": p.name, "No. of items": d2, "Days left": d3}
                exp.append(p2)
        return HttpResponse(exp)
