from .models import *
from rest_framework import serializers, fields

# Might be useless


class TransactionSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Product_Transaction
        fields = ["id", "name", "quantity", "rate"]


class BillSerializer(serializers.ModelSerializer):
    transaction = TransactionSerializer(read_only=True, many=True)
    name = serializers.CharField(source="employee.first_name", read_only=True)

    class Meta:
        model = Bill
        fields = ["id", "customer", "name", "date_time", "in_or_out", "transaction"]


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = [
            "id",
            "name",
            "quantity",
            "avg_cost_price",
            "latest_selling_price",
            "loose",
        ]


class ProductDeleteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Products
        fields = [
            "id",
            "name",
            "latest_selling_price",
            "loose",
            "avg_cost_price",
            "quantity",
        ]
