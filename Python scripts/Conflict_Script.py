import sqlite3
import pandas as pd
import json

def find_timeslots(start_time, end_time):
    # Compute the list of time slots that this course occupies
    time_slots = []
    if start_time[:3] != "TBA":
        start_time_mil = parse_time(start_time)
        end_time_mil = parse_time(end_time)

        time_slot = ["0830", "1000", "1130", "1300", "1430", "1600", "1730", "1900", "2030"]
        for time in time_slot:
            if int(start_time_mil) >= int(time):
                start_time_slot = time
            else:
                break

        for time in time_slot:
            if int(end_time_mil) < int(time):
                end_time_slot = prev_time_slot
                break
            else:
                prev_time_slot = time

        for time in time_slot:
            if time <= end_time_slot:
                if time >= start_time_slot:
                    time_slots.append(time)
    else:
        time_slots.append("TBA")

    return time_slots


def parse_time(time_str):
    """
    Convert a time string in "hhmma" format to military time (24-hour) format.
    """
    hours = int(time_str[:2])
    minutes = int(time_str[2:4])
    meridian = time_str[4:].upper()
    if meridian == "PM" and hours != 12:
        hours += 12
    elif meridian == "AM" and hours == 12:
        hours = 0
    return f"{hours:02d}{minutes:02d}"


def print_hash_table(hash_table):
    for day in hash_table:
        print(day.upper())
        for time_slot in hash_table[day]:
            if hash_table[day][time_slot]:
                print(f'{time_slot}:')
                for course in hash_table[day][time_slot]:
                    print(f'    {course.Class_Name}')


def create_hash_table(df):
    timetable = {}
    # Create the hash table
    class_hash = {}
    days = ["M", "T", "W", "R", "F", "TBA"]
    time_slots = ["0830", "1000", "1130", "1300", "1430", "1600", "1730", "1900", "2030", "TBA"]
    for day in days:
        class_hash[day] = {}
        for time_slot in time_slots:
            class_hash[day][time_slot] = []

    # puts classes into hashtable given standard times.  Pretty sure it handles
    # most issues
    # i.e., classes that are longer than 1:15
    #       "TBD" everywhere, typos etc....
    # This is pulling from scraped data that has had some preprocessing, not
    # perfect yet
    for i, row in df.iterrows():
        time_slots = find_timeslots(row['STime'], row['ETime'])
        if row['Days'].upper()[:3] != "TBA":
            for day in row['Days']:
                for time_slot in time_slots:
                    if day not in class_hash:
                        print("day not found")
                    if time_slot not in class_hash[day]:
                        print("time not found")
                    class_hash[day][time_slot].append(row)
        else:
            class_hash["TBA"]["TBA"].append(row)
    return class_hash


def main():
    # Load the configuration file
    with open('config.json') as f:
        config = json.load(f)

    # Access specific information in the dictionary
    class_conflicts = config['class_conflicts']
    conflict_ranges = config['class_ranges']
    teacher_classes = config['teacher_classes']
    hidden_classes = config['hidden_classes']
    hidden_subjects = config['hidden_subjects']
    ignore_classes = config['ignore_classes']
    ignore_subjects = config['ignore_subjects']
    allow_corequisite_conflicts = config['allow_corequisite_conflicts']

    # Create the SQL query to filter out hidden classes
    query = f"""
    SELECT CRN, Subject, Course, STime, ETime, Bldg, Room, Instructor, Days 
    FROM class_data 
    WHERE (Subject || ' ' || Course) NOT IN ({','.join(['?' for _ in hidden_classes])})
    AND Subject NOT IN ({','.join(['?' for _ in hidden_subjects])})
    """

    # query the database and store the results in a DataFrame
    conn = sqlite3.connect('class_information.db')
    params = hidden_classes + hidden_subjects
    classdata_df = pd.read_sql_query(query, conn, params=params)
    prereq_df = pd.read_sql_query("SELECT * from class_prereq", conn)
    classdata_df['Class_Name'] = classdata_df['Subject'] + ' ' + classdata_df['Course']
    conn.close()

    # hash classes into appropriate time slots
    class_hash = create_hash_table(classdata_df)

    conflicts = []
    # iterate through each day in the hash table
    for day in class_hash:

        # iterate through each time slot that has multiple classes
        for time_slot in class_hash[day]:

            # if the class hasn't been scheduled
            if time_slot != "TBA":

                # if there is more than one object in the cell
                if len(class_hash[day][time_slot]) > 1:

                    # iterate through each pair of classes in the time slot
                    for i in range(len(class_hash[day][time_slot])):
                        for j in range(i + 1, len(class_hash[day][time_slot])):
                            class1 = class_hash[day][time_slot][i]
                            class2 = class_hash[day][time_slot][j]



                            # verify classes are not being ignored 
                            if (class1.Subject not in ignore_subjects) and(class2.Subject not in ignore_subjects) and \
                                (class1.Class_Name not in ignore_classes) and (class2.Class_Name not in ignore_classes):

                                for class_conflict in class_conflicts:
                                    if (class1.Class_Name in class_conflict) and (class2.Class_Name in class_conflict):
                                        conflict = f"{class1.Class_Name} and {class2.Class_Name} cannot conflict"
                                        if conflict not in conflicts:
                                            conflicts.append(conflict)

                                # check for conflict range
                                if class1.Subject == class2.Subject:
                                    for conflict_range in conflict_ranges:
                                        if class1.Subject == conflict_range['subject'] and (int(conflict_range['start']) <= int(class1.Course[1:4]) <= int(conflict_range['end'])) and \
                                            (int(conflict_range['start']) <= int(class2.Course[1:]) <= int(conflict_range['end'])):

                                            conflict = f"{class1.Class_Name} and {class2.Class_Name} cannot conflict: within range {conflict_range['subject']} A{conflict_range['start']} - {conflict_range['subject']} A{conflict_range['end']}"
                                            if conflict not in conflicts:
                                                conflicts.append(conflict)

                                # compare instructors and locations for each pair of classes
                                if class1.Instructor == class2.Instructor:
                                    conflict = f"Instructor conflict between {class1.Class_Name} and {class2.Class_Name} on {day} at {time_slot}: {class1.Instructor}"
                                    if conflict not in conflicts:
                                        conflicts.append(conflict)

                                elif(class1.Bldg == class2.Bldg and class1.Room == class2.Room and class1.ETime > class2.STime and class2.ETime > class1.STime):
                                    conflict = f"Room conflict between {class1.Class_Name} and {class2.Class_Name} on {day} at {time_slot}: {class1.Bldg}, {class1.Room}"
                                    if conflict not in conflicts:
                                        conflicts.append(conflict)


    print_hash_table(class_hash)

    for item in conflicts:
        print(item)


if __name__ == "__main__":

    main()

