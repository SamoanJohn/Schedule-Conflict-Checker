# Generated by Django 4.1.6 on 2023-02-10 02:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0003_alter_class_data_options_alter_class_prereq_options'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='class_data',
            table='class_data',
        ),
        migrations.AlterModelTable(
            name='class_prereq',
            table='class_prereq',
        ),
    ]
