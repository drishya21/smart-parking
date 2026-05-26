#!/usr/bin/env bash

pip install -r requirements.txt

python manage.py migrate

python manage.py shell << END
from parking.models import ParkingSlot

for i in range(1, 11):
    ParkingSlot.objects.get_or_create(
        slot_number=f"A{i}",
        is_occupied=False
    )

print("Slots created")
END