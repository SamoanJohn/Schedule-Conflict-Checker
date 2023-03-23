from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Count
from website.models import MajorRequirements, Subjects
# Create your views here.

# def calendar(request):
#     return render(request, 'scheduler.html')

def calendar(request):
    degree_major_data = MajorRequirements.objects.values('degree', 'major').annotate(count=Count('index')).order_by('degree', 'major')
    subject_data = Subjects.objects.values('subject', 'subj').order_by('subject', 'subj')

    context = {
        'degree_major_data': degree_major_data,
        'subject_data': subject_data
    }
    return render(request, 'scheduler.html', context)