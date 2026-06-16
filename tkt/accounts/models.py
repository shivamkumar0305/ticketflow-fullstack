from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# Create your models here.


class UserManager(BaseUserManager):

    def create_user(self,email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have email')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)

        return user
    
    def create_superuser(self, email, password=None, **extra_fields):

        user = self.create_user(email,password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user



class User(AbstractBaseUser, PermissionsMixin):

    

    ROLE_CHOICE = [
        ('AG', 'Agent'),
        ('US', 'Regular')
    ]

    email = models.EmailField(unique=True, null=False, blank=False)
    full_name = models.CharField(max_length=255, blank=True, null=True) # Added full_name field
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=2, choices=ROLE_CHOICE, default='AG')
    USERNAME_FIELD = 'email'
    

    objects = UserManager()

    def __str__(self):
        return self.email
    


