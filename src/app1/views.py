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


class ProductUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductUpdateSerializer


def buy(request):

    if request.method == 'POST':

        try:
            re = Products.objects.get(name=request.POST['name'])

            re.avg_cost_price = (((re.avg_cost_price * re.quantity) +
                                  (int(request.POST['avg_cost_price']) * int(request.POST['quantity']))) / (int(request.POST['quantity']) + re.quantity))
            re.quantity = re.quantity + int(request.POST['quantity'])
            re.save()
            for i in range(1, int(request.POST['quantity']) + 1):
                itobj = Items(product=re)
                itobj.save()
                trobj = Product_Transaction(product=re, quantity=int(
                    request.POST['quantity']), rate=int(request.POST['avg_cost_price']), in_or_out="In")
            trobj.save()
            tr = Products.objects.get(name=request.POST['name'])
            created = {"created": False}
            dict_obj = model_to_dict(tr)
            dict_obj.update(created)
            serialized = json.dumps(dict_obj)

        except Products.DoesNotExist:

            name = request.POST['name']
            quant = request.POST['quantity']
            mrp = request.POST['mrp']
            avg_cost_price = request.POST['avg_cost_price']
            loose = request.POST['loose']
            pdt = Products(name=name, quantity=quant, mrp=mrp,
                           avg_cost_price=avg_cost_price, loose=loose)
            pdt.save()
            for i in range(1, int(request.POST['quantity']) + 1):
                itobj = Items(product=pdt)
                itobj.save()
            trobj = Product_Transaction(product=pdt, quantity=int(
                request.POST['quantity']), rate=int(request.POST['avg_cost_price']), in_or_out="In")
            trobj.save()
            tr = Products.objects.get(name=request.POST['name'])
            created = {"created": True}
            dict_obj = model_to_dict(tr)
            dict_obj.update(created)
            serialized = json.dumps(dict_obj)

            return HttpResponse(serialized)


def sell(request):
    d = Items.objects.filter(product__name="Lays")
    print(d)
    if request.method == 'POST':

        re = get_object_or_404(Products, name=request.POST['name'])

        if (re.quantity - int(request.POST['quantity']) >= 0):

            re.quantity = re.quantity - int(request.POST['quantity'])
            re.save()

            if (re.loose == True):
                pt = Product_Transaction.objects.filter(product__name=re.name)
                if(len(pt) != 0):
                    rt = pt[len(pt) - 1].rate

                else:

                    rt = None  # Default value

            else:
                rt = re.mrp
            trobj = Product_Transaction(product=re, quantity=int(
                request.POST['quantity']), rate=rt, in_or_out="Out")
            trobj.save()

            it = Items.objects.filter(product__name=re.name)
            for i in range(0, int(request.POST['quantity'])):
                it[i].delete()

            tr = Products.objects.get(name=request.POST['name'])
            created = {"created": False}
            dict_obj = model_to_dict(tr)
            dict_obj.update(created)
            serialized = json.dumps(dict_obj)
            return HttpResponse(serialized)
