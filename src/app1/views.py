from __future__ import unicode_literals

from django.shortcuts import render
from .models import *
from  .serializers import *
from rest_framework import generics
# Create your views here.
def login(request):
	return render(request, "app1/index.html")



   # Might be useless
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