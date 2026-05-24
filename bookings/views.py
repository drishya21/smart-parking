from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from parking.models import ParkingSlot


@api_view(['POST'])
def book_slot(request):

    slot_number = request.data.get("slot_number")

    try:
        slot = ParkingSlot.objects.get(slot_number=slot_number)

    except ParkingSlot.DoesNotExist:
        return Response(
            {"error": "Slot not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if slot.is_occupied:
        return Response(
            {"error": "Slot already booked"},
            status=status.HTTP_400_BAD_REQUEST
        )

    slot.is_occupied = True
    slot.save()

    return Response({
        "message": "Booking successful"
    })