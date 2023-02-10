from django.contrib import admin
from .models import class_data, class_prereq
# Register your models here.

admin.site.register(class_data)
admin.site.register(class_prereq)

