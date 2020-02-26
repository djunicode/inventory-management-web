from django.contrib import admin

from .models import Product_Transaction, Products, Bill, Items

admin.site.register(Product_Transaction)
admin.site.register(Products)
admin.site.register(Bill)
admin.site.register(Items)
