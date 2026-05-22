from django.db import models
from django.contrib.auth.models import User
from parking.models import ParkingSlot


class Booking(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    slot = models.ForeignKey(
        ParkingSlot,
        on_delete=models.CASCADE
    )

    hours = models.IntegerField()

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    booking_time = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.slot.slot_number}"