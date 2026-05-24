from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import ParkingSlot
from .serializers import ParkingSlotSerializer


# -------------------------
# BASE CLASS (optional but clean)
# -------------------------
class BaseParkingSlotListView(generics.ListAPIView):
    serializer_class = ParkingSlotSerializer
    permission_classes = [AllowAny]


# -------------------------
# ALL SLOTS
# -------------------------
class ParkingSlotListView(BaseParkingSlotListView):
    queryset = ParkingSlot.objects.all()


# -------------------------
# VACANT SLOTS (GREEN)
# -------------------------
class VacantSlotListView(BaseParkingSlotListView):

    def get_queryset(self):
        return ParkingSlot.objects.filter(is_occupied=False)


# -------------------------
# OCCUPIED SLOTS (RED)
# -------------------------
class OccupiedSlotListView(BaseParkingSlotListView):

    def get_queryset(self):
        return ParkingSlot.objects.filter(is_occupied=True)
    
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ParkingSlot


@api_view(['POST'])
def reset_slots(request):
    ParkingSlot.objects.all().update(is_occupied=False)
    return Response({
        "message": "All slots are now green"
    })    
    