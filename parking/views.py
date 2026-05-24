from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import ParkingSlot
from .serializers import ParkingSlotSerializer


class ParkingSlotListView(generics.ListAPIView):
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer
    permission_classes = [AllowAny]   # 🔥 THIS FIXES 401


class VacantSlotListView(generics.ListAPIView):
    serializer_class = ParkingSlotSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ParkingSlot.objects.filter(is_occupied=False)


class OccupiedSlotListView(generics.ListAPIView):
    serializer_class = ParkingSlotSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ParkingSlot.objects.filter(is_occupied=True)