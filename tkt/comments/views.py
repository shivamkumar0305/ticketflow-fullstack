from django.shortcuts import render
from .serializer import CommentSerializer
from .models import Comment
from tickets.models import Ticket
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404



# Create your views here.
class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_ticket_or_deny(self):
        ticket_id = self.kwargs.get('ticket_id')
        ticket = get_object_or_404(Ticket , id=ticket_id)
        user = self.request.user

        if not user.is_staff and ticket.created_by != user:
            self.permission_denied(
                self.request,
                message="You do not have permission to view or commeont on this ticket"
            )
        return ticket
        
    def get_queryset(self):
            ticket = self.get_ticket_or_deny()
            return Comment.objects.filter(ticket=ticket)
        
    def perform_create(self, serializer):
            ticket = self.get_ticket_or_deny()
            serializer.save(created_by=self.request.user, ticket=ticket)

    

