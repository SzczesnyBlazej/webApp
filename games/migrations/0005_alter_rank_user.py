# Generated by Django 4.1.6 on 2023-02-21 21:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('games', '0004_alter_rank_games_alter_rank_score_alter_rank_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rank',
            name='user',
            field=models.ForeignKey(default='Gość', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]