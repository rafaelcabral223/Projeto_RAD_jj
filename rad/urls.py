from django.urls import path

from . import views

app_name = "rad"

urlpatterns = [
    path("", views.inicio, name="inicio"),
]
