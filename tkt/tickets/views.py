from django.shortcuts import render
from rest_framework import serializers,status
from rest_framework.response import Response
from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import TicketSerializer
from .models import Ticket,STATUS_CHOICES 

from accounts.models import User
from rest_framework.decorators import action

from .tasks import send_ticket_email_task



valid_statuses = []
for choice in STATUS_CHOICES:
    valid_statuses.append(choice[0])




# Create your views here.
class TicketsViewset(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Ticket.objects.all().order_by('-created_at')

        if not user.is_staff:
            queryset = queryset.filter(created_by=user)
        
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        return queryset
    
    @action(
        detail=True,
        methods=['patch'],
        url_path='assign',
        permission_classes =  [IsAuthenticated, IsAdminUser]
    )
    def assign_agent(self, request, pk=None):
        ticket = self.get_object()
        agent_id = request.data.get('agent')

        if not agent_id:
            return Response(
                {'error':'Agent ID is required.'},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from django.db.models import Q
            agent = User.objects.get(Q(id=agent_id) & (Q(is_staff=True) | Q(role='AG')))
        except User.DoesNotExist:
            return Response(
                {"error":"Assignment failed. provided id is not an agent id"},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        ticket.assigned_to = agent
        ticket.save()

        try:
            send_ticket_email_task.delay(ticket.id, 'assigned',agent.email)
        except Exception as e:
            print(f"Failed to queue assignment email: {e}")

        serializer = self.get_serializer(ticket)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(
        detail=True,
        methods =['patch'],
        url_path='status_update',
        permission_classes=[IsAuthenticated,IsAdminUser]
    )
    def status_update(self, request, pk=None): #what does pk=none do? 
        ticket = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response(
                {"error":"send a status"}, status = status.HTTP_400_BAD_REQUEST
            )
        
        if new_status not in valid_statuses:
            return Response(
                {'error':'pass only valid statuses'}, status=status.HTTP_400_BAD_REQUEST
            )
        
        ticket.status = new_status
        ticket.save()

        if new_status in ['closed','resolved'] and ticket.created_by.email:
            try:
                send_ticket_email_task.delay(ticket.id, 'resolved',ticket.created_by.email)
            except Exception as e:
                print(f"Failed to queue resolution email: {e}")

        serializer = self.get_serializer(ticket)
        return Response(
            {'message':'status updated!'}, status=status.HTTP_200_OK
        )
    

    
    

    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def perform_create(self, serializer):
        print(f"ticket is creating")
        ticket = serializer.save(created_by=self.request.user)
        if ticket.created_by.email:
            try:
                send_ticket_email_task.delay(
                    ticket.id,
                    'created',
                    ticket.created_by.email
                )
            except Exception as e:
                print(f"Failed to queue creation email: {e}")


