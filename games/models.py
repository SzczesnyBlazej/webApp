from django.db import models
from django.contrib.auth.models import User

class Rank(models.Model):
    rank_id = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    games = models.CharField(max_length=25)
    score = models.PositiveIntegerField()

    class Meta:
        unique_together = ('user', 'games', 'score')