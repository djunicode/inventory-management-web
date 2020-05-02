from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.conf import settings
from django.core.validators import RegexValidator
from datetime import datetime


class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Email required")
        if not password:
            raise ValueError("Password required")

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        user = self.create_user(email, password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    GENDER = [("M", "M"), ("F", "F"), ("Other", "Other")]

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    age = models.IntegerField(default=0)
    gender = models.CharField(choices=GENDER, max_length=15, default="M")
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    REQUIRED_FIELDS = ["first_name", "last_name", "age", "gender", "is_staff"]

    USERNAME_FIELD = "email"

    def __str__(self):
        return self.first_name


class Products(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    avg_cost_price = models.FloatField(blank=True, null=True)
    loose = models.BooleanField(default=False)
    latest_selling_price = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.name


class Items(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    barcode = models.CharField(max_length=100, blank=True, null=True)
    expiry = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.product.name


class Bill(models.Model):
    customer = models.CharField(max_length=100)
    employee = models.ForeignKey(User, on_delete=models.CASCADE, blank=True)
    date_time = models.DateTimeField(auto_now_add=True)
    taxes = models.FloatField()
    choices = (
        ("In", "In"),
        ("Out", "Out"),
    )

    in_or_out = models.CharField(max_length=20, choices=choices)

    def __str__(self):
        return self.customer


class Product_Transaction(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE,
        related_name="transaction",
        blank=True,
        null=True,
    )
    quantity = models.IntegerField()
    rate = models.FloatField()
    choices = (
        ("In", "In"),
        ("Out", "Out"),
    )
    in_or_out = models.CharField(max_length=20, choices=choices)

    def __str__(self):
        return self.product.name
