from django.urls import path
from .views import CreateBookingView

urlpatterns = [

    path(
        'book-slot/',
        CreateBookingView.as_view()
    ),
]