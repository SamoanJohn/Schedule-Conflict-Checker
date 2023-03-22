# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class CourseCoreq(models.Model):
    index = models.IntegerField(primary_key=True)
    course = models.TextField(db_column='Course', blank=True, null=True)  # Field name made lowercase.
    coreq = models.TextField(db_column='Coreq', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'course_coreq'


class CourseName(models.Model):
    course = models.TextField(db_column='Course', primary_key=True)  # Field name made lowercase.
    course_name = models.TextField(db_column='Course Name', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.

    class Meta:
        managed = False
        db_table = 'course_name'


class CoursePrereq(models.Model):
    index = models.IntegerField(primary_key=True)
    course = models.TextField(db_column='Course', blank=True, null=True)  # Field name made lowercase.
    prereq = models.TextField(db_column='Prereq', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'course_prereq'


class MajorRequirements(models.Model):
    index = models.IntegerField(primary_key=True)
    degree = models.TextField(db_column='Degree', blank=True, null=True)  # Field name made lowercase.
    major = models.TextField(db_column='Major', blank=True, null=True)  # Field name made lowercase.
    course = models.TextField(db_column='Course', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'major_requirements'


class Subjects(models.Model):
    subject = models.TextField(db_column='Subject', blank=True, null=True)  # Field name made lowercase.
    subj = models.TextField(db_column='Subj', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'subjects'
