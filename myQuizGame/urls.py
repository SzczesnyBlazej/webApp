from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('', include('homePage.urls')),
    path('', include('games.urls')),
    path('admin/', admin.site.urls),
]