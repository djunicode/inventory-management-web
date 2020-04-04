from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from app1.views import *
from rest_framework import routers
from django.conf.urls import url



urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("app1.urls")),
    url(r'^api/bill/$', BillListView.as_view()),
    url(r'^api/productlist/$', ProductListView.as_view()),
    url(r'^api/productlist/(?P<pk>\d+)/$',ProductUpdateView.as_view()),
    
    # Might be useless
    url(r'api/transactions/$',TransactionListView.as_view())
]