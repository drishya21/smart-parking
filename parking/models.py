from django.db import models


class ParkingSlot(models.Model):

    slot_number = models.CharField(max_length=10, unique=True)

    is_occupied = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.slot_number