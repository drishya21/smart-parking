from django.urls import path
from .views import book_slot

urlpatterns = [
    path('book-slot/', book_slot),
]