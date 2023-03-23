from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Count
from website.models import MajorRequirements, Subjects
from django.http import JsonResponse
import json 

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

def get_major_requirements(request):
    # get the url query "term=____majors=______subjects=______"
    term = request.GET.get('term')

    # split the majors and subjects.  Listed as "BS - Computer Science" and "CSCE - Computer Science and Computer Engineering"
    selected_majors = request.GET.get('majors')    
    majors_list = selected_majors.split(',')
    
    selected_subjects = request.GET.get('subjects')
    subjects_list = []
    if selected_subjects:
        subjects_list = selected_subjects.split(',')
    subj = []
    for item in subjects_list:
        subject, subject_name = item.split(' - ')
        subj.append(subject)


    # retrieve the requirements for each selected major
    courses = set()  # use a set to store all courses
    for major in majors_list:
        degree, major_name = major.split(' - ')
        major_courses = set()  # use a set to remove duplicates within a major
        for req in MajorRequirements.objects.filter(degree=degree.strip(), major=major_name.strip()):
            major_courses.add(req.course)
        courses.update(major_courses)  # add courses to the set of all courses

    # Remove courses in selected subjects
    courses = [c for c in courses if not any(c.startswith(s + " ") for s in subj)]

    # Sort the courses alphabetically
    courses = sorted(courses)

    # Initialize a dictionary to hold the course numbers for each subject
    courses_by_subject = {}

    # Loop through each course subject in the list of requirements
    for course in courses:
        # Split the course subject into its prefix and number components
        subject, number = course.split()
        # Add the current course number to the list for its subject
        courses_by_subject.setdefault(subject, []).append(number)

    urls = []
    # Loop through each subject and generate the corresponding URL
    for subject, numbers in courses_by_subject.items():
        # Combine the list of course numbers into a comma-separated string
        course_numbers = ",".join(number.replace(" ", "+") for number in numbers)
        # Generate the URL for the current subject and number combination
        url = "https://curric.uaa.alaska.edu/scheduleSearch.php?term={}&subj={}&crse={}".format(term, subject, course_numbers)
        urls.append(url)

    for s in subj:
        url = "https://curric.uaa.alaska.edu/scheduleSearch.php?term={}&subj={}".format(term, s)
        urls.append(url)


    return JsonResponse(urls, safe=False)
