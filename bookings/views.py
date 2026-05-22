from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Booking
from .serializers import BookingSerializer

from parking.models import ParkingSlot


class CreateBookingView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        slot_id = request.data.get('slot_id')

        hours = int(request.data.get('hours'))

        try:
            slot = ParkingSlot.objects.get(id=slot_id)

        except ParkingSlot.DoesNotExist:

            return Response(
                {"error": "Slot not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if slot.is_occupied:

            return Response(
                {"error": "Slot already occupied"},
                status=status.HTTP_400_BAD_REQUEST
            )

        amount = hours * 50

        booking = Booking.objects.create(
            user=request.user,
            slot=slot,
            hours=hours,
            amount=amount
        )

        slot.is_occupied = True
        slot.save()

        serializer = BookingSerializer(booking)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )