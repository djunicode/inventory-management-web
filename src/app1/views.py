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
from datetime import datetime, timedelta
from rest_framework import filters

# pagination
from .pagination import ProjectLimitOffsetPagination


@api_view(["POST"])
def user_update(request):
    try:
        if request.method == "POST":
            email = request.POST.get("email")
            user = User.objects.get(email=request.POST.get("email"))

            user.first_name = request.POST.get("first_name", None) or user.first_name
            user.last_name = request.POST.get("last_name", None) or user.last_name
            user.age = request.POST.get("age", None) or user.age
            user.gender = request.POST.get("gender", None) or user.gender
            user.is_staff = request.POST.get("is_staff", None) or user.is_staff
            user.is_active = request.POST.get("is_active", None) or user.is_active
            user.is_superuser = (
                request.POST.get("is_superuser", None) or user.is_superuser
            )
            user.save()

            return JsonResponse(
                data={"message": "User successfully updated."},
                status=status.HTTP_200_OK,
            )
    except:
        return JsonResponse(
            data={"message": "Some error occured. Please contact the administrator."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class User_Delete(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        try:
            if request.method == "POST":
                if dj_settings.TOKEN_MODEL:
                    dj_settings.TOKEN_MODEL.objects.filter(
                        user__email=request.POST.get("email")
                    ).delete()
                User.objects.get(email=request.POST.get("email")).delete()
                return JsonResponse(
                    data={"message": "User & Token successfully deleted."},
                    status=status.HTTP_200_OK,
                )
        except:
            return JsonResponse(
                data={
                    "message": "Some error occured. Please contact the administrator."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


def login(request):
    return render(request, "index.html")


class TransactionListView(generics.ListAPIView):
    """ View to Display all transactions irrespective of Bill """

    queryset = Product_Transaction.objects.all()
    serializer_class = TransactionSerializer
    # pagination_class = ProjectLimitOffsetPagination


class BillListView(generics.ListAPIView):
    """ View to Display all Bills """

    queryset = Bill.objects.all()
    serializer_class = BillSerializer


class ProductListView(generics.ListCreateAPIView):
    """ View to Display all Products """

    search_fields = ["name"]
    filter_backends = (filters.SearchFilter,)
    queryset = Products.objects.all()
    serializer_class = ProductListSerializer
    pagination_class = ProjectLimitOffsetPagination


class ProductDeleteView(generics.DestroyAPIView):
    """ View to Delete specific product from database using product id """

    queryset = Products.objects.all()
    serializer_class = ProductListSerializer


class Product_Update(generics.GenericAPIView):
    """ View to Update attributes of a specific product from database using product id (pid) """

    def post(self, request, pid, *args, **kwargs):
        """
        Parameters
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
        addition and deletion of items is done using the pname variable which stored earlier product name.
        """

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


class Buy(generics.GenericAPIView):
    """  View to buy Products """

    def post(self, request, *args, **kwargs):
        """
        Parameters
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

                # If product is not loose, add items to database
                re.save()

                if re.loose == False:
                    if (request.POST["expiry"] == "") or (
                        request.POST["expiry"] == None
                    ):
                        for i in range(0, int(request.POST["quantity"])):
                            itobj = Items(product=re, expiry=None)

                            itobj.save()
                    else:
                        for i in range(0, int(request.POST["quantity"])):
                            itobj = Items(product=re, expiry=request.POST["expiry"])
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

                # Create new product
                pdt = Products(name=name, quantity=quant, avg_cost_price=avg_cost_price)

                # Added Items as default loose= False
                pdt.save()

                if (request.POST["expiry"] == "") or (request.POST["expiry"] == None):
                    for i in range(0, int(request.POST["quantity"])):
                        itobj = Items(product=pdt, expiry=None)
                        itobj.save()
                else:
                    for i in range(0, int(request.POST["quantity"])):
                        itobj = Items(product=pdt, expiry=request.POST["expiry"])
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


class Sell(generics.GenericAPIView):
    """ View to sell products """

    def post(self, request, *args, **kwargs):
        """
        Parameters
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
        Transaction is then saved as an OUT transaction and suitable response is returned
        """

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

                    it = re.items_set.all()[: int(request.POST["quantity"])]
                    for i in it:
                        i.delete()

                # Send Required Response
                tr = Products.objects.get(name=request.POST["name"])
                created = {"created": False}
                dict_obj = model_to_dict(tr)
                dict_obj.update(created)
                serialized = json.dumps(dict_obj)
                if tr.quantity == 0:
                    tr.delete()
                return HttpResponse(serialized)

            except Products.DoesNotExist:
                res = HttpResponse("Product Does not exist")
                res.status_code = 404
                return res


class Profit(generics.GenericAPIView):
    """
    Profit class
    ---------------------
    (GET): Gets data from transactions, and sends a list of items sold in a month, and overall
    ----------------------
    The GET function takes each product from Product's objects, and runs a search in all the product transactions,
    with the field being the product name.
    After this, we run by the transactions month-wise, to get the transactions made in each month
    In each transaction, we check if the type of transaction is 'IN' or 'OUT',
    if IN, it means that a product has been bought.
    so the money transactions made are added to cost price, both monthly and overall
    and the quantity of items are added to the 'items bought' counter
    else, implying that the product has been sold,
    the money transactions made are added to the selling price, both monthly and overall
    and the quantity of items are added to the 'items bought' counter

    returns: A JSON response consisting of the total cost, selling price and quantity of items bought/sold,
    monthly and overall, for each product

    """

    def get(self, request, *args, **kwargs):
        serializer_class = ProfitSerializer
        products = Products.objects.all()
        result = {}
        result["Total"] = {}
        cp_total = 0
        q_cp_total = 0
        sp_total = 0
        q_sp_total = 0
        months = []
        # final_profit = {}

        for i in products:
            product_profit = Product_Transaction.objects.filter(product=i)

            for j in product_profit:

                month = str(j.date.strftime("%Y-%m"))
                if month not in months:
                    months.append(month)
                if month not in result:
                    result[month] = {}

            result["Total"][str(i)] = {
                "earned": 0.0,
                "spent": 0.0,
                "sold": 0,
                "bought": 0,
            }
            for m in result:
                if m != "Total":
                    profit_product_monthly = product_profit.filter(
                        date__year=m.split("-")[0], date__month=m.split("-")[1]
                    )

                    cp = 0
                    q_cp = 0
                    sp = 0
                    q_sp = 0

                    result[m][str(i)] = {
                        "earned": 0.0,
                        "spent": 0.0,
                        "sold": 0,
                        "bought": 0,
                    }
                    for transaction in profit_product_monthly:
                        if transaction.in_or_out == "In":
                            cp = cp + transaction.quantity * transaction.rate
                            q_cp += transaction.quantity
                            # print("bought", m, cp, q_cp)
                        else:
                            sp = sp + transaction.quantity * transaction.rate
                            q_sp += transaction.quantity
                            # print("sold", m, sp, q_sp)
                    if q_cp:
                        # print(result[m][str(i)]["spent"])
                        result[m][str(i)]["spent"] = cp
                        result[m][str(i)]["bought"] = q_cp
                        result["Total"][str(i)]["spent"] += cp
                        result["Total"][str(i)]["bought"] += q_cp

                    if q_sp:
                        result[m][str(i)]["earned"] = sp
                        result[m][str(i)]["sold"] = q_sp
                        result["Total"][str(i)]["earned"] += sp
                        result["Total"][str(i)]["sold"] += q_sp

                    cp_total += cp
                    sp_total += sp
                    q_cp_total += q_cp
                    q_sp_total += q_sp
                    result["Total"]["Total"] = {
                        "earned": sp_total,
                        "spent": cp_total,
                        "sold": q_sp_total,
                        "bought": q_cp_total,
                    }

        # result["Total"]["earned"]= sp_total,
        # result["Total"]["sold"]= sp_total,
        # result["Total"]["spent"]= cp_total,
        # result["Total"]["bought"]= q_cp_total,

        # calculating total per month:
        for mon in months:
            m_cp = 0.0
            m_sp = 0.0
            m_q_cp = 0
            m_q_sp = 0
            for i in products:
                m_cp += result[mon][str(i)]["spent"]
                m_sp += result[mon][str(i)]["earned"]
                m_q_cp += result[mon][str(i)]["bought"]
                m_q_sp += result[mon][str(i)]["sold"]
                # print(result[mon][str(i)])
            result[mon]["Total"] = {
                "earned": m_sp,
                "spent": m_cp,
                "sold": m_q_sp,
                "bought": m_q_cp,
            }

        return JsonResponse(result)


class Expiry(generics.GenericAPIView):
    # pagination_class = ProjectLimitOffsetPagination
    def get(self, request, *args, **kwargs):
        pr = Products.objects.all()
        limit = int(request.GET.get("limit", -1))
        offset = int(request.GET.get("offset", -1))
        a = {}
        data = []
        for p in pr:
            i = p.items_set.all()
            for j in range(0, 4):

                d = datetime.now().date() + timedelta(days=j)

                d1 = i.filter(expiry=d)
                d2 = len(d1)

                if d2 != 0:
                    p2 = {
                        "Product": str(p.name),
                        "No. of items": str(d2),
                        "Days left": str(j),
                    }
                    data.append(p2)

        a["count"] = len(data)

        a["results"] = data
        if limit >= 0 and offset >= 0:
            if limit + offset < len(data):
                a["exp"] = data[offset : offset + limit]
            elif offset < len(data):
                a["exp"] = data[offset:]

        return JsonResponse(a)
        # Create a for loop with datetime.now + i and make i =3 so check all dates till next 3 dates


class ProductSearch(generics.ListCreateAPIView):
    search_fields = ["name"]
    filter_backends = (filters.SearchFilter,)
    queryset = Products.objects.all()
    serializer_class = ProductListSerializer
