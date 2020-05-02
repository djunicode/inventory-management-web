from __future__ import unicode_literals
from django.shortcuts import render, get_object_or_404
from djoser.conf import settings as dj_settings
from django.http import HttpResponse, JsonResponse
from .models import *
import json
from django.forms.models import model_to_dict
from .serializers import *
from rest_framework import generics
from django.core import serializers


def user_delete(request):
    if request.method == "POST":
        if dj_settings.TOKEN_MODEL:
            dj_settings.TOKEN_MODEL.objects.filter(
                user__email=request.POST.get("email")
            ).delete()
        User.objects.get(email=request.POST.get("email")).delete()
    return HttpResponse("")


def login(request):
    return render(request, "app1/index.html")


class TransactionListView(generics.ListAPIView):
    queryset = Product_Transaction.objects.all()
    serializer_class = TransactionSerializer


class BillListView(generics.ListAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer


class ProductListView(generics.ListCreateAPIView):

    queryset = Products.objects.all()
    serializer_class = ProductListSerializer


class ProductDeleteView(generics.DestroyAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductDeleteSerializer


def product_update(request, pid):

    if request.method == "POST":
        pr = Products.objects.get(id=pid)
        pname = pr.name
        pr.name = request.POST["name"]
        pr.latest_selling_price = request.POST["latest_selling_price"]

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
        pr.save()
        dict_obj = model_to_dict(pr)
        serialized = json.dumps(dict_obj)
        return HttpResponse(serialized)


def buy(request):

    if request.method == "POST":

        try:
            re = Products.objects.get(name=request.POST["name"])

            re.avg_cost_price = (
                (re.avg_cost_price * re.quantity)
                + (int(request.POST["avg_cost_price"]) * int(request.POST["quantity"]))
            ) / (int(request.POST["quantity"]) + re.quantity)
            re.quantity = re.quantity + int(request.POST["quantity"])
            re.save()

            if re.loose == False:
                for i in range(1, int(request.POST["quantity"]) + 1):
                    itobj = Items(product=re)
                    itobj.save()
            trobj = Product_Transaction(
                product=re,
                quantity=int(request.POST["quantity"]),
                rate=int(request.POST["avg_cost_price"]),
                in_or_out="In",
            )
            trobj.save()
            tr = Products.objects.get(name=request.POST["name"])
            created = {"created": False}
            dict_obj = model_to_dict(tr)
            dict_obj.update(created)
            serialized = json.dumps(dict_obj)
            return HttpResponse(serialized)

        except Products.DoesNotExist:

            name = request.POST["name"]
            quant = request.POST["quantity"]

            avg_cost_price = request.POST["avg_cost_price"]

            pdt = Products(name=name, quantity=quant, avg_cost_price=avg_cost_price)
            pdt.save()
            for i in range(1, int(request.POST["quantity"]) + 1):
                itobj = Items(product=pdt)
                itobj.save()
            trobj = Product_Transaction(
                product=pdt,
                quantity=int(request.POST["quantity"]),
                rate=int(request.POST["avg_cost_price"]),
                in_or_out="In",
            )
            trobj.save()
            tr = Products.objects.get(name=request.POST["name"])
            created = {"created": True}
            dict_obj = model_to_dict(tr)
            dict_obj.update(created)
            serialized = json.dumps(dict_obj)

            return HttpResponse(serialized)


def sell(request):

    if request.method == "POST":

        re = get_object_or_404(Products, name=request.POST["name"])

        if re.quantity - int(request.POST["quantity"]) >= 0:

            re.quantity = re.quantity - int(request.POST["quantity"])
            if re.loose == True:
                re.latest_selling_price = request.POST["latest_selling_price"]
            re.save()

        trobj = Product_Transaction(
            product=re,
            quantity=int(request.POST["quantity"]),
            rate=request.POST["latest_selling_price"],
            in_or_out="Out",
        )
        trobj.save()

        if re.loose == False:

            it = Items.objects.filter(product__name=re.name)
            for i in range(0, int(request.POST["quantity"])):
                it[i].delete()

        tr = Products.objects.get(name=request.POST["name"])
        created = {"created": False}
        dict_obj = model_to_dict(tr)
        dict_obj.update(created)
        serialized = json.dumps(dict_obj)
        return HttpResponse(serialized)
