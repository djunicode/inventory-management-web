from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from .views import (
    user_delete,
    login,
    TransactionListView,
    BillListView,
    ProductListView,
    ProductUpdateView,
    buy, sell,
)

from django.conf.urls import url

urlpatterns = [
    path("auth/user_delete/", csrf_exempt(user_delete), name="user_delete"),
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
    path("login/", login, name="login"),
    url(r"^api/bill/$", BillListView.as_view()),
    url(r"^api/productlist/$", ProductListView.as_view()),
    url(r"^api/productlist/(?P<pk>\d+)/$", ProductUpdateView.as_view()),
    url("api/buy/", csrf_exempt(buy)),
    url("api/sell/", csrf_exempt(sell)),
    # Might be useless
    url(r"api/transactions/$", TransactionListView.as_view()),
]
