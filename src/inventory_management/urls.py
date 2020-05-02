from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from rest_framework import routers


urlpatterns = [
    path("", include("app1.urls")),
    path("admin/", admin.site.urls),
]
