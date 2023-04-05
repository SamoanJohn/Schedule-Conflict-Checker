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

def calendar(request):
    # queries database tables MajorRequirements and Subjects used to populate dropdown menues 
    degree_major_data = MajorRequirements.objects.values('degree', 'major').annotate(count=Count('index')).order_by('degree', 'major')
    subject_data = Subjects.objects.values('subject', 'subj').order_by('subject', 'subj')
    context = {
        'degree_major_data': degree_major_data,
        'subject_data': subject_data
    }
    return render(request, 'scheduler.html', context)


def get_major_requirements(request):
    # get term, majors, and subject from client
    selected_term = request.GET.get('term')
    selected_majors = request.GET.get('majors')    
    selected_subjects = request.GET.get('subjects')

    # selected_subjects can be empty
    selected_subj = []
    if selected_subjects:
        selected_subjects = selected_subjects.split(',')
        for subject in selected_subjects:
            abbreviation, full_name = subject.split(' - ')  # e.g., "CSCE - Computer Science and Computer Engineering"
            selected_subj.append(abbreviation)


    # retrieve  requirements for each selected major
    courses = set()  # use a set to store all courses
    selected_majors = selected_majors.split(',')
    for degree_major in selected_majors:
        degree, major = degree_major.split(' - ')   # e.g., "BS - Computer Science" 
        major_requirements = set()   # used to delete duplicate courses
        for requirement in MajorRequirements.objects.filter(degree=degree.strip(), major=major.strip()):
            major_requirements.add(requirement.course)
        courses.update(major_requirements)  # append major_requirments to list of courses

    # Remove courses included in the selected subjects
    courses = [course for course in courses if not any(course.startswith(subj + " ") for subj in selected_subj)]
    courses = sorted(courses)

    # create an dictionary of courses by subject
    courses_by_subject = {}
    for course in courses:
        # e.g., "CSCE A101" -> "CSCE", "A101"
        subj, number = course.split()
        courses_by_subject.setdefault(subj, []).append(number)


    # create appropriate urls for scraping
    urls = []
    for subj, numbers in courses_by_subject.items():
        # Combine the list of course numbers into a comma-separated string
        course_numbers = ",".join(numbers.replace(" ", "+") for numbers in numbers)
        url = "https://curric.uaa.alaska.edu/scheduleSearch.php?term={}&subj={}&crse={}".format(selected_term, subj, course_numbers)
        urls.append(url)
    for subj in selected_subj:
        url = "https://curric.uaa.alaska.edu/scheduleSearch.php?term={}&subj={}".format(selected_term, subj)
        urls.append(url)

    thread_count = min(os.cpu_count(), len(urls))
    # seperates urls into batches determined by avaliable resourses
    url_batches = [urls[i::thread_count] for i in range(thread_count)]
    scraping_futures = []
    temp_dataframe_list = []

    # scrape data for each batch of URLs using ThreadPoolExecutor
    with concurrent.futures.ThreadPoolExecutor() as executor:
        for url_batch in url_batches:
            # initiate threads in batches determined by avaliable resources
            scraping_future = executor.submit(scrape_urls, url_batch)
            scraping_futures.append(scraping_future)

    # retrieve the results of the futures and store them in a list of DataFrames
    for scraping_future in concurrent.futures.as_completed(scraping_futures):
        try:
            scraped_dataframe = scraping_future.result()
            temp_dataframe_list.append(scraped_dataframe)
                
        except Exception as e:
            print(f"Threading exception occurred: {e}")
            # dataframes.append(pd.DataFrame())

    # Concatenate list of dataframes into a single dataframe
    class_data_df = pd.concat(temp_dataframe_list)
    class_data_df = class_data_df.dropna(how='all') # deletes any empty rows
    class_data_df = class_data_df.rename(columns={'Del Mthd': 'DelMthd'})

    # some data cleanup functions. the university data isnt very consistent.  this is just to extract the important information
    clean_whitespace = lambda x: re.sub(r'\s{2,}', ' ', x.strip()) if isinstance(x, str) else x

    # if it includes the string ONLINE + something else, delete ONLINE e.g., "209ONLINE" -> "209"
    clean_online = lambda s: s.replace("ONLINE", "") if s != "ONLINE" else s    

    # if it includes the string DIST + something else, delete DIST e.g., "ECB DIST" -> ECB
    clean_dist = lambda s: s.replace("DIST", "") if s != "DIST" else s

    # all this does is deletes any duplicate string. e.g., "MWMW" -> "MW", "10/2110/21" -> "10/21", or "0130pm0130pm -> 0130pm"
    clean_duplicates = lambda x: re.sub(r'(\S+)\1(?!\S)', r'\1', x) if isinstance(x, str) else x

    # Apply the cleanup functions to dataframe
    class_data_df[['Days', 'STime', 'ETime', 'SDate', 'EDate']] = class_data_df[['Days', 'STime', 'ETime', 'SDate', 'EDate']].applymap(clean_duplicates)
    class_data_df[['Bldg']] = class_data_df[['Bldg']].applymap(clean_dist)
    class_data_df[['Room']] = class_data_df[['Room']].applymap(clean_online)
    class_data_df = class_data_df.applymap(clean_whitespace)
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

    temp_dataframe_list = []
    try:
        for url in urls:
            url = str(url)
            driver.get(url) # open url 
            time.sleep(2)   # wait for js to populate
            html = driver.page_source
            soup = BeautifulSoup(html, 'html.parser')
            table = soup.find('table', {'class': 'table table-striped table-condensed'})

            # Extract headers
            headers = []
            for th in table.find_all('th'):     #<th></th>
                headers.append(th.text.strip())

            # Extract the table rows and store them in a list of lists
            class_data = []
            for tr in table.find_all('tr')[1:]:     #<tr></tr>
                row_data = []
                for td in tr.find_all('td'):     #<td></td>
                    row_data.append(td.text.strip())
                class_data.append(row_data)

            scraped_dataframe = pd.DataFrame(class_data, columns=headers)
            temp_dataframe_list.append(scraped_dataframe)

        driver.quit()

        # Concatenate the dataframes
        if temp_dataframe_list:
            class_data_df = pd.concat(temp_dataframe_list)
        else:
            class_data_df = pd.DataFrame()
        return class_data_df

    # occurs when the query has no data in curric.  for example summer classes with limited listings
    except UnexpectedAlertPresentException:
        print(f"No data found for URL: {url}")
        # Skip to the next URL
        pass