from rest_framework import generics
from .models import ParkingSlot
from .serializers import ParkingSlotSerializer


class ParkingSlotListView(generics.ListAPIView):

    queryset = ParkingSlot.objects.all()

    serializer_class = ParkingSlotSerializer


class VacantSlotListView(generics.ListAPIView):

    serializer_class = ParkingSlotSerializer

    def get_queryset(self):
        return ParkingSlot.objects.filter(is_occupied=False)


class OccupiedSlotListView(generics.ListAPIView):

    serializer_class = ParkingSlotSerializer

    def get_queryset(self):
        return ParkingSlot.objects.filter(is_occupied=True)