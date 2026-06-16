from rest_framework import serializers
from .models import Ticket
from accounts.serializers import UserSerializer

class TicketSerializer(serializers.ModelSerializer):
    customer_email = serializers.SerializerMethodField()
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)

    class Meta : 
        model = Ticket
        fields = ['id', 'title', 'description', 'status', 'priority', 'created_by', 'assigned_to', 'created_at', 'updated_at', 'customer_email']
        read_only_fields = ['id', 'status', 'created_by', 'assigned_to', 'created_at', 'updated_at', 'customer_email']

    def get_customer_email(self, obj):
        return obj.created_by.email

    def validate(self,attrs):
        if self.instance:
            for field in attrs.keys():
                if field!= 'description':
                    raise serializers.ValidationError({
                        field : "you are only allowed to change description"
                    })
        return attrs
        
