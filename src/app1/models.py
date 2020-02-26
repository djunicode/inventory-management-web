from django.db import models
from datetime import datetime


class Products(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    avg_cost_price = models.FloatField()
    loose = models.BooleanField()

    def __str__(self):
        return self.name


class Items(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    barcode = models.CharField(max_length=100)
    expiry = models.DateTimeField()

    def __str__(self):
        return self.product


class Product_Transaction(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)

    quantity = models.IntegerField()
    rate = models.FloatField()
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)

    def __str__(self):
        return self.product


class Bill(models.Model):
    person = models.CharField(max_length=100)
    date_time = models.DateTimeField(auto_now_add=True)
    taxes = models.FloatField()
    Choices = (
        ("In", "In"),
        ("Out", "Out"),
    )

    in_or_out = models.CharField(max_length=20, choices=Choices,)

    def __str__(self):
        return self.person
