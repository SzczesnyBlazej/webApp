from django.urls import path

from homePage.views import *

urlpatterns = [
    path('', index),

    path('guessWho/', guessWho),
    path('checkPlayer/', checkPlayer, name='checkPlayer'),

    path('whoMore/', whoMore),
    path('checkWhoMore/', checkWhoMore, name='checkWhoMore'),

    path('scatter/', scatter),
    path('scatterCheck/', scatterCheck, name='scatterCheck'),

]
