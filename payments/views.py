import razorpay

from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

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

        payment_link = client.payment_link.create({

            "amount": amount,

            "currency": "INR",

            "accept_partial": False,

            "description": "Parking Slot Booking",

            "notify": {
                "sms": True,
                "email": False
            }
        })

        payment = Payment.objects.create(

            booking=booking,

            razorpay_order_id=payment_link['id'],

            payment_link=payment_link['short_url'],

            amount=booking.amount
        )

        serializer = PaymentSerializer(payment)

        return Response({

            "payment": serializer.data,

            "payment_url": payment_link['short_url']
        })


class VerifyPaymentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        payment_id = request.data.get('payment_id')

        try:
            payment = Payment.objects.get(
                razorpay_order_id=payment_id
            )

        except Payment.DoesNotExist:

            return Response({
                "error": "Payment not found"
            })

        payment.is_paid = True

        payment.razorpay_payment_id = payment_id

        payment.save()

        booking = payment.booking

        ticket = {

            "message": "BOOKING CONFIRMED",

            "booking_id": booking.id,

            "user": booking.user.username,

            "slot": booking.slot.slot_number,

            "hours": booking.hours,

            "amount_paid": booking.amount,

            "payment_status": "SUCCESS",

            "booking_time": booking.booking_time
        }

        return Response(
            ticket,
            status=status.HTTP_200_OK
        )