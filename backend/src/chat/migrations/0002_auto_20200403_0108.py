# Generated by Django 3.0.4 on 2020-04-03 01:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='athor',
            new_name='author',
        ),
    ]