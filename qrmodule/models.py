from django.db import models
from bookings.models import Booking


class QRCode(models.Model):

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE
    )

    qr_image = models.ImageField(
        upload_to='qr_codes/'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"QR - {self.booking.id}"