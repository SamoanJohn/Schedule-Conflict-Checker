# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class ClassData(models.Model):
    crn = models.TextField(db_column='CRN', primary_key=True)  # Field name made lowercase.
    camp = models.TextField(db_column='Camp', blank=True, null=True)  # Field name made lowercase.
    pot = models.TextField(db_column='POT', blank=True, null=True)  # Field name made lowercase.
    subj_crs_sec = models.TextField(db_column='Subj Crs Sec', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    title = models.TextField(db_column='Title', blank=True, null=True)  # Field name made lowercase.
    crd = models.TextField(db_column='Crd', blank=True, null=True)  # Field name made lowercase.
    cont_hrs = models.TextField(db_column='Cont Hrs', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    days = models.TextField(db_column='Days', blank=True, null=True)  # Field name made lowercase.
    stime = models.TextField(db_column='STime', blank=True, null=True)  # Field name made lowercase.
    etime = models.TextField(db_column='ETime', blank=True, null=True)  # Field name made lowercase.
    bldg = models.TextField(db_column='Bldg', blank=True, null=True)  # Field name made lowercase.
    room = models.TextField(db_column='Room', blank=True, null=True)  # Field name made lowercase.
    sdate = models.TextField(db_column='SDate', blank=True, null=True)  # Field name made lowercase.
    edate = models.TextField(db_column='EDate', blank=True, null=True)  # Field name made lowercase.
    instructor = models.TextField(db_column='Instructor', blank=True, null=True)  # Field name made lowercase.
    aprv = models.TextField(db_column='Aprv', blank=True, null=True)  # Field name made lowercase.
    cap = models.TextField(db_column='Cap', blank=True, null=True)  # Field name made lowercase.
    enr = models.TextField(db_column='Enr', blank=True, null=True)  # Field name made lowercase.
    wait_max = models.TextField(db_column='Wait Max', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    wait = models.TextField(db_column='Wait', blank=True, null=True)  # Field name made lowercase.
    attn = models.TextField(db_column='Attn', blank=True, null=True)  # Field name made lowercase.
    attr = models.TextField(db_column='Attr', blank=True, null=True)  # Field name made lowercase.
    xst = models.TextField(db_column='XST', blank=True, null=True)  # Field name made lowercase.
    web = models.TextField(db_column='Web', blank=True, null=True)  # Field name made lowercase.
    sess_code = models.TextField(db_column='Sess Code', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    del_mthd = models.TextField(db_column='Del Mthd', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    pacing = models.TextField(db_column='Pacing', blank=True, null=True)  # Field name made lowercase.
    mtg_times = models.TextField(db_column='Mtg Times', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    site = models.TextField(db_column='Site', blank=True, null=True)  # Field name made lowercase.
    sec_notes = models.TextField(db_column='Sec Notes', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    tuiw = models.TextField(db_column='TUIW', blank=True, null=True)  # Field name made lowercase.
    code1 = models.TextField(db_column='Code1', blank=True, null=True)  # Field name made lowercase.
    fee1 = models.TextField(db_column='Fee1', blank=True, null=True)  # Field name made lowercase.
    code2 = models.TextField(db_column='Code2', blank=True, null=True)  # Field name made lowercase.
    fee2 = models.TextField(db_column='Fee2', blank=True, null=True)  # Field name made lowercase.
    code3 = models.TextField(db_column='Code3', blank=True, null=True)  # Field name made lowercase.
    fee3 = models.TextField(db_column='Fee3', blank=True, null=True)  # Field name made lowercase.
    code4 = models.TextField(db_column='Code4', blank=True, null=True)  # Field name made lowercase.
    fee4 = models.TextField(db_column='Fee4', blank=True, null=True)  # Field name made lowercase.
    code5 = models.TextField(db_column='Code5', blank=True, null=True)  # Field name made lowercase.
    fee5 = models.TextField(db_column='Fee5', blank=True, null=True)  # Field name made lowercase.
    code6 = models.TextField(db_column='Code6', blank=True, null=True)  # Field name made lowercase.
    fee6 = models.TextField(db_column='Fee6', blank=True, null=True)  # Field name made lowercase.
    code7 = models.TextField(db_column='Code7', blank=True, null=True)  # Field name made lowercase.
    fee7 = models.TextField(db_column='Fee7', blank=True, null=True)  # Field name made lowercase.
    code8 = models.TextField(db_column='Code8', blank=True, null=True)  # Field name made lowercase.
    fee8 = models.TextField(db_column='Fee8', blank=True, null=True)  # Field name made lowercase.
    code9 = models.TextField(db_column='Code9', blank=True, null=True)  # Field name made lowercase.
    fee9 = models.TextField(db_column='Fee9', blank=True, null=True)  # Field name made lowercase.
    code10 = models.TextField(db_column='Code10', blank=True, null=True)  # Field name made lowercase.
    fee10 = models.TextField(db_column='Fee10', blank=True, null=True)  # Field name made lowercase.
    code11 = models.TextField(db_column='Code11', blank=True, null=True)  # Field name made lowercase.
    fee11 = models.TextField(db_column='Fee11', blank=True, null=True)  # Field name made lowercase.
    code12 = models.TextField(db_column='Code12', blank=True, null=True)  # Field name made lowercase.
    fee12 = models.TextField(db_column='Fee12', blank=True, null=True)  # Field name made lowercase.
    uaonlinelink = models.TextField(db_column='UAOnlineLink', blank=True, null=True)  # Field name made lowercase.
    subject = models.TextField(db_column='Subject', blank=True, null=True)  # Field name made lowercase.
    course = models.TextField(db_column='Course', blank=True, null=True)  # Field name made lowercase.
    section = models.TextField(db_column='Section', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'class_data'


class ClassPrereq(models.Model):
    crn = models.TextField(primary_key=True)
    subject = models.TextField(db_column='Subject', blank=True, null=True)  # Field name made lowercase.
    course = models.TextField(db_column='Course', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'class_prereq'
