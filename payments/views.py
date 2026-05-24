import razorpay

from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response


client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)


@api_view(['POST'])
def create_order(request):

    amount = int(request.data.get("amount")) * 100

    payment = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": "1"
    })

    return Response(payment)