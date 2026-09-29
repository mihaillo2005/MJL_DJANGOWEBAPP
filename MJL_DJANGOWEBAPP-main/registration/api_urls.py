from django.urls import path
from .api_views import student_api, student_detail_api

urlpatterns = [
    path('students/', student_api, name='student_api'),
    path('students/<int:pk>/', student_detail_api, name='student_detail_api'),
]