# Generated by Django 3.0.7 on 2020-06-23 19:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trend_app', '0002_auto_20200621_0205'),
    ]

    operations = [
        migrations.AddField(
            model_name='trend',
            name='geo',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
