from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    #for password security 
    password = serializers.CharField(write_only=True, required=True, style={'input_type':'password'})

    class Meta :
        model= User
        fields = ['id','email','full_name','is_staff','is_active','role','password']
        read_only_fields = ['id','is_staff','is_active']

    def create(self, validated_data):

        user_role = validated_data.get('role','US')
        full_name = validated_data.get('full_name', '') # Get full_name from validated_data

        user = User.objects.create_user(
            email = validated_data['email'],
            password= validated_data['password'],
            full_name = full_name # Assign full_name
        )

        user.role = user_role
        user.save()
        return user