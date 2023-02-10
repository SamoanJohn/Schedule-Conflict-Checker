from django.db import models

# Create your models here.

#class class_data(models.Model):
#    CRN = models.IntegerField(primary_key=True)
#    subject = models.CharField(max_length=10)
#    course = models.CharField(max_length=10)
#    section = models.CharField(max_length=10)
#    class_name = models.CharField(max_length=50)
#    days = models.CharField(max_length=10, null=True)
#    start_time = models.CharField(max_length=10, null=True)
#    end_time = models.CharField(max_length=10, null=True)
#    building = models.CharField(max_length=10, null=True)
#    room = models.CharField(max_length=10, null=True)
#    instructor = models.CharField(max_length=50, null=True)

#    def __str__(self):
#        return self.class_name

#class class_prereq(models.Model):
#    CRN = models.IntegerField()
#    prereq_CRN = models.IntegerField(null=True)



class class_data(models.Model):
    crn = models.IntegerField(db_column='CRN', primary_key=True,)  # Field name made lowercase.
    subject = models.TextField(blank=True, null=True)
    course = models.TextField(blank=True, null=True)
    section = models.TextField(blank=True, null=True)
    class_name = models.TextField(blank=True, null=True)
    days = models.TextField(blank=True, null=True)
    start_time = models.TextField(blank=True, null=True)
    end_time = models.TextField(blank=True, null=True)
    building = models.TextField(blank=True, null=True)
    room = models.TextField(blank=True, null=True)  # This field type is a guess.
    text = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'class_data'
    


class class_prereq(models.Model):
    crn = models.IntegerField(db_column='CRN', primary_key=True)  # Field name made lowercase.
    prereq_crn = models.TextField(db_column='prereq_CRN', blank=True, null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        managed = False
        db_table = 'class_prereq'


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