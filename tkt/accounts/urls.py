from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import HelloView, UserProfileView,RegisterUserView, MyTokenObtainPairView

urlpatterns = [
    path('api/token/' , MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/test/', HelloView.as_view(), name='Testing'),
    path('api/user/me/', UserProfileView.as_view(), name='user-profile'),
    path('api/user/register/',RegisterUserView.as_view(), name='register-user'),
    
]