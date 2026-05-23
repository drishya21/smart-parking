from django.urls import path

from .views import (
    CreatePaymentView,
    VerifyPaymentView
)

urlpatterns = [

    path(
        'create-payment/',
        CreatePaymentView.as_view()
    ),

    path(
        'verify-payment/',
        VerifyPaymentView.as_view()
    ),
]