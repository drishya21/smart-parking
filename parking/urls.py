from django.urls import path
from .views import (
    ParkingSlotListView,
    VacantSlotListView,
    OccupiedSlotListView,
    reset_slots
)

urlpatterns = [
    path('slots/', ParkingSlotListView.as_view()),
    path('vacant-slots/', VacantSlotListView.as_view()),
    path('occupied-slots/', OccupiedSlotListView.as_view()),

    # 🔥 ADD THIS
    path('reset-slots/', reset_slots),
]