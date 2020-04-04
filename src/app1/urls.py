from django.urls import path, include
from . import views

urlpatterns = [
    # path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
    path("login/", views.login, name="login"),
]
