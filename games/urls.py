from django.urls import path

from games.views import *

urlpatterns = [

    path('guessWho/', guessWho),
    path('checkPlayer/', checkPlayer, name='checkPlayer'),

    path('whoMore/', whoMore),
    path('checkWhoMore/', checkWhoMore, name='checkWhoMore'),

    path('scatter/', scatter),
    path('scatterCheck/', scatterCheck, name='scatterCheck'),

    path('addScoreToRank/', addScoreToRank),
    path('showRank/', showRank, name='showRank'),
    path('showRankButton/', showRankButton, name='showRankButton'),

]
