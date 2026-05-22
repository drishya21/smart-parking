from django.urls import path
from .views import (
    ParkingSlotListView,
    VacantSlotListView,
    OccupiedSlotListView
)

urlpatterns = [

    path('slots/', ParkingSlotListView.as_view()),

    path('vacant-slots/', VacantSlotListView.as_view()),

    path('occupied-slots/', OccupiedSlotListView.as_view()),
]