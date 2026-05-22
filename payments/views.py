import razorpay

from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from bookings.models import Booking

from .models import Payment
from .serializers import PaymentSerializer


class CreatePaymentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        booking_id = request.data.get('booking_id')

        try:
            booking = Booking.objects.get(id=booking_id)

        except Booking.DoesNotExist:

            return Response({
                "error": "Booking not found"
            })

        client = razorpay.Client(auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_KEY_SECRET
        ))

        amount = int(booking.amount * 100)

        payment_order = client.order.create({
            'amount': amount,
            'currency': 'INR',
            'payment_capture': '1'
        })

        payment = Payment.objects.create(
            booking=booking,
            razorpay_order_id=payment_order['id'],
            amount=booking.amount
        )

        serializer = PaymentSerializer(payment)

        return Response({
            "payment": serializer.data,
            "order": payment_order
        })