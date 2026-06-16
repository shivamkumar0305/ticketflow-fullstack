from rest_framework import serializers
from .models import Comment
from accounts.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta :
        model = Comment
        fields =['id','comment','created_by','created_at','ticket']
        read_only_fields = ['id','created_at','created_by','ticket']
    