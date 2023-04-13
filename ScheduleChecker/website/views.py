from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db.models import Count
from website.models import MajorRequirements, Subjects
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
#import requests
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import numpy as np
import sqlite3


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
    if selected_majors:
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

        # some data cleanup functions. the university data isnt very consistent.  this is just to extract the important information
    clean_whitespace = lambda x: re.sub(r'\s{2,}', ' ', x.strip()) if isinstance(x, str) else x

    # Concatenate list of dataframes into a single dataframe
    class_data_df = pd.concat(temp_dataframe_list)
    class_data_df = class_data_df.dropna(how='all') # deletes any empty rows
    class_data_df = class_data_df.rename(columns={'Del Mthd': 'DelMthd'})
    class_data_df = class_data_df.applymap(clean_whitespace)
    class_data_df[['Subj', 'Crs', 'Sec']] = class_data_df['Subj Crs Sec'].str.split(' ', expand=True)
    class_data_df = class_data_df.loc[:, ['CRN', 'Subj',"Crs","Sec","Title","Days","STime","ETime","Bldg","Room","Instructor","DelMthd"]]

    # Apply the cleanup functions to dataframe
    class_data_df["STime"] = class_data_df["STime"].apply(parse_time)
    class_data_df["ETime"] = class_data_df["ETime"].apply(parse_time)

    class_data_df[["Days", "STime", "ETime", "Bldg", "Room"]] = class_data_df.apply(narrow_down, axis=1, result_type="expand")
    class_data_df.to_csv('output.txt', sep='\t', index=False)

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
            wait = WebDriverWait(driver, 20) # wait up to 10 seconds for the table to load
            wait.until(EC.visibility_of_element_located((By.CLASS_NAME, 'table-striped'))) # wait for the table to be visible
            html = driver.page_source
            soup = BeautifulSoup(html, 'html.parser')
            table = soup.find('table', {'class': 'table table-striped table-condensed'})

            # Extract headers
            headers = []
            for th in table.find_all('th'):     #<th></th>
                headers.append(th.text.strip())

            # Extract the table rows and store them in a list of lists
            class_data = []
            for tr in table.find_all('tr')[1:]:
                row_data = []
                for td in tr.find_all('td'):
                    if '<br/>' in str(td):
                        tag_str_list = str(td).split('<br/>')
                        tag_list = [BeautifulSoup(tag_str_list[0], 'html.parser')]
                        tag_list += [BeautifulSoup('<td>' + tag_str, 'html.parser').find() for tag_str in tag_str_list[1:]]
                        cell_text = [tag.text.strip() for tag in tag_list]
                        cell_text = [cell for cell in cell_text if cell != '']
                        if len(cell_text) == 1:
                            cell_text = cell_text[0]
                    else:
                        cell_text = td.text.strip()
                    row_data.append(cell_text)
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


    """
    Convert a time string in "hhmma" format to military time (24-hour) format.
    """
def parse_time(time_str):
    if isinstance(time_str, list):
        return [parse_time(t) for t in time_str]
    elif len(time_str) == 6:
        hours = int(time_str[:2])
        minutes = int(time_str[2:4])
        meridian = time_str[4:].upper()
        if meridian == "PM" and hours != 12:
            hours += 12
        elif meridian == "AM" and hours == 12:
            hours = 0
        return f"{hours:02d}{minutes:02d}"
    else:
        return time_str


'''
This function eliminates the multi row cells and chooses the most relevent cell
It also eliminates some potentially usefull information from some classes like labs    
'''

def narrow_down(row):
    if isinstance(row["Days"], list):
        scores = []
        for i in range(len(row["Days"])):
            score = 0
            if row["Days"][i] == "TBA":
                score += 1
            if row["STime"][i] == "TBA":
                score += 1
            if row["ETime"][i] == "TBA":
                score += 1
            if row["Bldg"][i] == "DIST":
                score += 1
            if (row["Room"][i] == "ONLINE") or (row["Room"][i] == "BLKBD"):
                score += 1
            scores.append(score)
        index = scores.index(min(scores))
        days = row["Days"][index]
        stime = row["STime"][index]
        etime = row["ETime"][index]
        bldg = row["Bldg"][index]
        room = row["Room"][index]
        return days, stime, etime, bldg, room
    else:
        return row["Days"], row["STime"], row["ETime"], row["Bldg"], row["Room"]