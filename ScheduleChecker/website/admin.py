from django.contrib import admin
from .models import CourseCoreq, CoursePrereq, CourseName, MajorRequirements, Subjects
# Register your models here.

admin.site.register(CourseCoreq)
admin.site.register(CoursePrereq)
admin.site.register(CourseName)
admin.site.register(MajorRequirements)
admin.site.register(Subjects)




