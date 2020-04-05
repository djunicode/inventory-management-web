from __future__ import unicode_literals
from django.shortcuts import render
from djoser.conf import settings as dj_settings
from django.http import HttpResponse
from .models import *
from .serializers import *
from rest_framework import generics


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
