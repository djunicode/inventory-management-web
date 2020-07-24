from .models import *
from rest_framework import serializers, fields

# Might be useless


class TransactionSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Product_Transaction
        fields = ["id", "name", "quantity", "rate", "in_or_out", "billdetails"]


class BillSerializer(serializers.ModelSerializer):
    transaction = TransactionSerializer(read_only=True, many=True)
    name = serializers.CharField(source="employee.first_name", read_only=True)

    class Meta:
        model = Bill
        fields = ["id", "customer", "name", "date_time", "in_or_out", "transaction"]


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = "__all__"


class ProfitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Transaction
        fields = "__all__"
