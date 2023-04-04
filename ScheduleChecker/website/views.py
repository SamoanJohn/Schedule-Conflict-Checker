from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Count
from website.models import MajorRequirements, Subjects
from django.http import JsonResponse
import json 
from selenium import webdriver
from selenium.common.exceptions import UnexpectedAlertPresentException
from bs4 import BeautifulSoup
import pandas as pd
import threading
import concurrent.futures
import time
import os
import re


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

    # Scrape the data using multiple threads
    thread_count = min(5, len(urls))
    url_batches = [urls[i::thread_count] for i in range(thread_count)]
    # create a list of futures
    futures = []
    dataframes = []


    # scrape data for each batch of URLs using ThreadPoolExecutor
    with concurrent.futures.ThreadPoolExecutor() as executor:
        for batch in url_batches:
            future = executor.submit(scrape_urls, batch)
            futures.append(future)

    # retrieve the results of the futures and store them in a list of DataFrames
    for future in concurrent.futures.as_completed(futures):
        try:
            data = future.result()
            if not data.empty:
                dataframes.append(data)
        except Exception as e:
            print(f"Exception occurred: {e}")
            dataframes.append(pd.DataFrame())

    # Concatenate dataframes into a single dataframe
    class_data_df = pd.concat(dataframes)

    class_data_df = class_data_df.dropna(how='all')

    class_data_df = class_data_df.rename(columns={'Del Mthd': 'DelMthd'})
    # some data cleanup functions
    clean_whitespace = lambda x: re.sub(r'\s{2,}', ' ', x.strip()) if isinstance(x, str) else x
    clean_duplicates = lambda x: re.sub(r'(\S+)\1(?!\S)', r'\1', x) if isinstance(x, str) else x
    clean_online = lambda s: s.replace("ONLINE", "") if s != "ONLINE" else s
    clean_dist = lambda s: s.replace("DIST", "") if s != "DIST" else s

    # Apply the cleanup function to dataframe
    class_data_df = class_data_df.applymap(clean_whitespace)
    class_data_df[['Days', 'STime', 'ETime', 'SDate', 'EDate']] = class_data_df[['Days', 'STime', 'ETime', 'SDate', 'EDate']].applymap(clean_duplicates)
    class_data_df[['Bldg']] = class_data_df[['Bldg']].applymap(clean_dist)
    class_data_df[['Room']] = class_data_df[['Room']].applymap(clean_online)
    class_data_df[['Subj', 'Crs', 'Sec']] = class_data_df['Subj Crs Sec'].str.split(' ', expand=True)
    class_data_df = class_data_df.loc[:, ['CRN', 'Subj',"Crs","Sec","Title","Days","STime","ETime","Bldg","SDate","EDate","Instructor","DelMthd"]]

    print(class_data_df)
    return JsonResponse({'data': class_data_df.to_json(orient='records')})

def scrape_urls(urls):
    # Create a webdriver instance
    driver_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'chromedriver')
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(executable_path=driver_path, options=options)

    dataframes = []

    try:
        for url in urls:
            # Navigate to the URL
            url = str(url)
            driver.get(url)

            # Wait for JS to populate data
            time.sleep(2)

            # Parse the HTML
            html = driver.page_source
            soup = BeautifulSoup(html, 'html.parser')

            # Extract the data
            # extract the table
            table = soup.find('table', {'class': 'table table-striped table-condensed'})

            headers = []
            for th in table.find_all('th'):
                headers.append(th.text.strip())

            # Extract the table rows and store them in a list of lists
            class_data = []
            for tr in table.find_all('tr')[1:]:
                # find row data
                row = []
                for td in tr.find_all('td'):
                    row.append(td.text.strip())

                class_data.append(row)

            # Convert the list of lists to a pandas dataframe
            df = pd.DataFrame(class_data, columns=headers)
            dataframes.append(df)

        # Quit the webdriver instance
        driver.quit()

        # Concatenate the dataframes
        if dataframes:
            df_combined = pd.concat(dataframes, ignore_index=True)
        else:
            df_combined = pd.DataFrame()

        return df_combined
    
    except UnexpectedAlertPresentException as e:
        # Quit the webdriver instance
        driver.quit()

        # Log the error message
        print(f"One or more URLs returned no class data")

        # Return an empty dataframe
        return pd.DataFrame()
