from django.urls import path
from . import views

urlpatterns = [
    path('api/upload', views.upload, name='upload'),
    path('api/check/<str:_id>', views.check, name='check'),
]
