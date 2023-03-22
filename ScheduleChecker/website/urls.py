from django.urls import path
from website.views import calendar

urlpatterns = [
    path('', calendar),
]
