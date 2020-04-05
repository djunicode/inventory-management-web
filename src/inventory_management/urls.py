from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from rest_framework import routers


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("app1.urls")),
]