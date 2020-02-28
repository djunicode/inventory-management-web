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

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    GENDER = [("M", "M"), ("F", "F"), ("Transgender", "Transgender")]

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    age = models.IntegerField(default=0)
    gender = models.CharField(blank=True, null=True, choices=GENDER, max_length=15)
    phone_regex = RegexValidator(
        regex=r"^\+?1?\d{9,10}$", message="Phone number must be valid"
    )
    phone = models.CharField(
        validators=[phone_regex], max_length=10, blank=True, null=True, default=None
    )
    date_joined = models.DateTimeField(auto_now_add=True)
    position = models.CharField(max_length=50)
    salary = models.IntegerField(blank=True, null=True, default=None)
    shift_time_start = models.TimeField(blank=True, null=True)
    shift_time_end = models.TimeField(blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email

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
    
class Product_Transaction(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)

    quantity = models.IntegerField()
    rate = models.FloatField()
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)

    def __str__(self):
        return self.product

