from django.db import models
from accounts.models import User
from tickets.models import Ticket


# Create your models here.
class Comment(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta : 
        ordering = ['created_at']

    def __str__(self):
        return f"comment by {self.created_by} under {self.ticket}"
