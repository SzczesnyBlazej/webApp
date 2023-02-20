from django.urls import path, re_path

from homePage.views import *

urlpatterns = [
    path('', index),
    path('register/', register, name='register'),
    path("logout/", logout_request),
    path('login/', login_view, name='login'),

]
