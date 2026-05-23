import qrcode

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

        qr_data = payment.payment_link

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

        return Response(serializer.data)