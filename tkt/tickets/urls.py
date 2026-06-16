from django.urls import path,include
from .views import TicketsViewset

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'tickets',TicketsViewset, basename="ticket")

urlpatterns=[
    path('', include(router.urls)),
    path('tickets/<int:ticket_id>/comments/',include('comments.urls'))
    ]