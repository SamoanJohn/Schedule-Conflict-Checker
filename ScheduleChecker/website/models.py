from django.db import models

# Create your models here.

class class_data(models.Model):
    CRN = models.IntegerField(primary_key=True)
    subject = models.CharField(max_length=10)
    course = models.CharField(max_length=10)
    section = models.CharField(max_length=10)
    class_name = models.CharField(max_length=50)
    days = models.CharField(max_length=10, null=True)
    start_time = models.CharField(max_length=10, null=True)
    end_time = models.CharField(max_length=10, null=True)
    building = models.CharField(max_length=10, null=True)
    room = models.CharField(max_length=10, null=True)
    instructor = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.class_name

class class_prereq(models.Model):
    CRN = models.IntegerField()
    prereq_CRN = models.IntegerField(null=True)

    def __str__(self):
        return self.CRN




#c.execute("""CREATE TABLE class_data (
#             CRN integer,
#             subject text,
#             course text,
#             section text,
#             class_name text,
#             days text,
#             start_time text,
#             end_time text,
#             building text,
#             room, text
#             instructor text
#             )""")

#c.execute("""CREATE TABLE class_prereq (
#             CRN integer,
#             prereq_CRN, integer
#             )""")