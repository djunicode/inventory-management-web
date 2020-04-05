from django.shortcuts import render
from djoser.conf import settings
from .models import User
from django.http import HttpResponse


def user_delete(request):
    if request.method == "POST":
        if settings.TOKEN_MODEL:
            settings.TOKEN_MODEL.objects.filter(
                user__email=request.POST.get("email")
            ).delete()
        User.objects.get(email=request.POST.get("email")).delete()
    return HttpResponse("")
