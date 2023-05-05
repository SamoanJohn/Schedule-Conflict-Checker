# Schedule Checker Team - Austin Edwards, John Schwenke, and Conner Trouy
# May 4th, 2023
# Contributions:
#   This script was designed by Austin 
#
# Dependencies:
#   The major requirements scraping process is dependent on the University website for its data


import requests
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver
import time
import sqlite3
import re
import numpy as np



'''
# Connect to the database
conn = sqlite3.connect('class_information.db')

# Create a cursor object
cursor = conn.cursor()

# Execute a query
cursor.execute("SELECT DISTINCT degree, major FROM major_requirements")
# Fetch the results
results = cursor.fetchall()

# Print the results
for row in results:
    print(row)


# Close the database connection
conn.close()

'''
url = 'https://catalog.uaa.alaska.edu/undergraduateprograms/#programlistingtext'
base_url = 'https://catalog.uaa.alaska.edu/'
response = requests.get(url)

# parse the HTML content using BeautifulSoup
soup = BeautifulSoup(response.content, 'html.parser')


headers = [['Bachelor of Arts', 'BA'],
           ['Bachelor of Business Administration', 'BBA'],
           ['Bachelor of Fine Arts', 'BFA'],
           ['Bachelor of Human Services', 'BHS'],
           ['Bachelor of Music', 'BM'],
           ['Bachelor of Science', 'BS'],
           ['Bachelor of Social Work', 'BSW']]



major_degree = []
major_requirements = []
for header in headers:
    degree = header[0]
    degree_acronym = header[1]
    print(degree.upper())
    # find the <h3> tag with the text "Bachelor of Arts"
    bachelors_html = soup.find('h3', string=degree)
    # get the HTML under the <h3> tag
    # find the table immediately following the <h3> tag
    table = bachelors_html.find_next_sibling('table')

    # find all the <a> tags within the table
    links = table.find_all('a')

    # loop through the <a> tags and extract the text and href attributes

    for link in links:
        text = link.text
        href = link['href']

        if re.search(r'\*$', text):
            text = re.sub(r'\*$', '', text)

        if not text.endswith("(suspended)"):
            major = text
            print(degree_acronym + ' ' + major)
            major_url = href
            response = requests.get(base_url + major_url)

            # parse the HTML content using BeautifulSoup
            major_requirements_html = BeautifulSoup(response.content, 'html.parser')
            td_tags = major_requirements_html.find_all('td', class_='codecol')

            for td in td_tags:
                # find the <a> tag within the <td> tag
                a_tag = td.find('a', class_='bubblelink code')
                if a_tag:
                    # extract the text content of the <a> tag and append it to the list
                    course_code = a_tag.text.strip()
                    course_code = course_code.replace("\xa0", " ")

                    if "/" in course_code:
                        # split the string into two parts
                        parts = course_code.split(" ")

                        # split the first part into multiple parts based on "/"
                        nums = parts[0].split("/")
                        major_codes = []
                        for num in nums:
                            # get the major code and modify the course code
                            subject= num.replace(num, "").strip("/")
                            course_code = num.replace("/", " ") + " " + parts[1]
    
                            course_code = subject + " " + course_code
                            course_code = course_code.lstrip()

                            # append the major code and course code to the list
                            print(course_code)
                            major_requirements.append([degree_acronym, major, course_code])
                        # print the resulting major codes and course codes

                    else:
                        # print the input string without modification
                        print(course_code)
                        major_requirements.append([degree_acronym, major, course_code])

            print()

            print
# Connect to the SQLite database

major_requirements = [list(t) for t in set(tuple(lst) for lst in major_requirements)]
conn = sqlite3.connect('class_information.db')

headers = ['Degree','Major','Course']
major_requirements_df = pd.DataFrame(major_requirements, columns=headers)


# Write the dataframe to an SQLite table
major_requirements_df.to_sql('major_requirements', conn, if_exists='replace', index=True)

# Close the database connection
conn.close()