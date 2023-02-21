from django.db import models
from django.contrib.auth.models import User


class Rank(models.Model):
    rank_id = models.AutoField(primary_key=True)
    user = models.CharField(max_length=155, null=True, default='AnonymousUser')
    games = models.CharField(max_length=25, default='Nieznane', null=True)
    score = models.PositiveIntegerField(default=0, null=True)

    def __str__(self):
        return "%s's Rank" % self.rank_id
