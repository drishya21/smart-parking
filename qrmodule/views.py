import qrcode
import json
from io import BytesIO

from django.core.files import File

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from bookings.models import Booking
from payments.models import Payment

from .models import QRCode
from .serializers import QRCodeSerializer


class GenerateQRCodeView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        booking_id = request.data.get('booking_id')

        try:
            booking = Booking.objects.get(id=booking_id)

        except Booking.DoesNotExist:

            return Response({
                "error": "Booking not found"
            })

        try:
            payment = Payment.objects.get(booking=booking)

        except Payment.DoesNotExist:

            return Response({
                "error": "Payment not found"
            })

        qr_data = json.dumps({
    "booking_id": booking.id,
    "user": booking.user.username,
    "slot": booking.slot.slot_number,
    "payment_link": payment.payment_link
})

        qr = qrcode.make(qr_data)

        buffer = BytesIO()

        qr.save(buffer, format='PNG')

        qr_code = QRCode(booking=booking)

        qr_code.qr_image.save(
            f'booking_{booking.id}.png',
            File(buffer),
            save=True
        )

        serializer = QRCodeSerializer(qr_code)

        return  Response({
    "qr": serializer.data,
    "booking": {
        "id": booking.id,
        "slot": booking.slot.slot_number,
        "user": booking.user.username,
        "booked_at": booking.booked_at
    },
    "payment": {
        "payment_link": payment.payment_link
    }
})