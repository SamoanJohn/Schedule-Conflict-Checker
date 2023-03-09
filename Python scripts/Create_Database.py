import requests
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver
import time
import sqlite3
import re
import numpy as np


# URL for the curric page,  magic url so can query i.e., subj=CSCE 
url = 'https://curric.uaa.alaska.edu/scheduleSearch.php?term=202301&subj=CSCE'

# need a webdriver to properly load the webpage for JS to run
# Download at https://chromedriver.storage.googleapis.com/index.html?path=109.0.5414.74/
browser = webdriver.Chrome(executable_path=r"C:\Users\austi\source\repos\PythonApplication2\PythonApplication2\chromedriver.exe\chromedriver.exe")
browser.get(url)

# wait for JS to populate data
time.sleep(.5)

# parse the html
html = browser.page_source
soup = BeautifulSoup(html, 'html.parser')

# extract the table

table = soup.find('table', {'class': 'table table-striped table-condensed'})

# Extract the table headers and store them in a list
headers = []
for th in table.find_all('th'):
    headers.append(th.text.strip())

headers.append("UAOnlineLink")

# Extract the table rows and store them in a list of lists
class_data = []
for tr in table.find_all('tr')[1:]:
    # find UAOnline Link
    td_tag = tr.find("td", class_="course")
    a_tag = td_tag.find("a")
    link = a_tag.get("href")

    # find row data
    row = []
    for td in tr.find_all('td'):
        row.append(td.text.strip())

    row.append(link)
    class_data.append(row)
    

# Put class data in excel sheet
class_data_df = pd.DataFrame(class_data, columns=headers)
del class_data_df[class_data_df. columns[0]]


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
class_data_df[['Subject', 'Course', 'Section']] = class_data_df['Subj Crs Sec'].str.split(' ', expand=True)


##############################################################
#  Now getting prereq data using the uaonline link

class_prereq = []
headers = ['crn','Subject','Course']

# for each row in the class information database
for row in class_data_df.itertuples(index=False):
    # request html from uaonline
    url = row.UAOnlineLink
    response = requests.get(url)

    # parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # find the course summary section and split at prerequisites
    class_summary = soup.find("td", class_="ntdefault")
    class_summary = class_summary.text.strip()
    prerequisites = class_summary.split('Prerequisites:', 1)[-1]

    # search for CSCE A123, this will be a pre-req or co-req, both should likely be treated the same
    pattern = r'\b[A-Za-z]{2,4} A\d{3}\b'

    # search for matches in the string
    prerequisites = re.findall(pattern, prerequisites)
    
    # append all of the prereqs to the prereq table
    for item in prerequisites:
        split_string = item.split(" ")
        Subject = split_string[0]
        Course = split_string[1]

        class_prereq.append([row.CRN, Subject, Course])

# convert to dataframe
class_prereq_df = pd.DataFrame(class_prereq, columns=headers)

# Connect to the SQLite database
conn = sqlite3.connect('class_information.db')

# Write the dataframe to an SQLite table
class_data_df.to_sql('class_data', conn, if_exists='replace', index=False)
class_prereq_df.to_sql('class_prereq', conn, if_exists='replace', index=False)

# Close the database connection
conn.close()

