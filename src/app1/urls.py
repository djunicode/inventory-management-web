from django.urls import path, include
from .views import (
    user_delete,
    login,
    TransactionListView,
    BillListView,
    ProductListView,
    ProductUpdateView,
)
from django.views.decorators.csrf import csrf_exempt
from django.conf.urls import url

urlpatterns = [
    path("auth/user_delete/", csrf_exempt(user_delete), name="user_delete"),
    path("auth/", include("djoser.urls")),    
    path("auth/", include("djoser.urls.authtoken")),
    path("login/", login, name="login"),
    url(r"^api/bill/$", BillListView.as_view()),
    url(r"^api/productlist/$", ProductListView.as_view()),
    url(r"^api/productlist/(?P<pk>\d+)/$", ProductUpdateView.as_view()),
    # Might be useless
    url(r"api/transactions/$", TransactionListView.as_view()),
]
