from django.urls import path
from . import views

urlpatterns = [
    path('upload', views.upload, name='upload'),
    path('check/<str:_id>', views.check, name='check'),
]
