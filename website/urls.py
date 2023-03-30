from django.urls import path
from website.views import calendar, get_major_requirements

urlpatterns = [
    path('', calendar),
    path('query/', get_major_requirements, name='get_major_requirements'),
]
