from django.urls import path, include
from .views import user_delete
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path("auth/user_delete/", csrf_exempt(user_delete), name="user_delete"),
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
]
