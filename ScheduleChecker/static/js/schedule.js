window.classes = {}

var selectedItems = {
  majors: [],
  subjects: []
};

var class_array = []

function removeItem(element, type) {
  var item = $(element).parent().text().trim();
  var index = selectedItems[type].indexOf(item);
  selectedItems[type].splice(index, 1);
  $(element).parent().remove();
}



$(document).ready(function() {
  $('#major-dropdown').change(function() {
    var selectedMajor = $(this).val();
    if (selectedMajor !== '') {
      var majors = selectedItems.majors;
      if (!majors.includes(selectedMajor)) {
        majors.push(selectedMajor);
        var selectedItem = $('<div class="selected-item"><span class="remove-item" onclick="removeItem(this, \'majors\')"></span><span>' + selectedMajor + '</span></div>');
        $('#selected-majors').append(selectedItem);
        $(this).val('');
      }
      $(this).val('');
    }
  });

  $('#subject-dropdown').change(function() {
    var selectedSubject = $(this).val();
    if (selectedSubject !== '') {
      var subjects = selectedItems.subjects;
      if (!subjects.includes(selectedSubject)) {
        subjects.push(selectedSubject);
        var selectedItem = $('<div class="selected-item"><span class="remove-item" onclick="removeItem(this, \'subjects\')"></span><span>' + selectedSubject + '</span></div>');
        $('#selected-subjects').append(selectedItem);
        $(this).val('');
      }
      $(this).val('');
    }
  });

  $('#semester-select').change(function() {
    var selectedSemester = $(this).val();
  });
});


window.addEventListener('load', function() {
  // define a function to handle the button press
  function handleSearchButtonClick() {

      var selectedTerm = $('#semester-select').val();

      // check if a term is selected
      if (!selectedTerm) {
          alert("Please select a term.");
          return;
      }

      // get the selected majors from the dropdown
      var selectedMajors =  selectedItems.majors.join(',')

      var selectedSubjects =  selectedItems.subjects.join(',')
      
      // check if at least one major or subject is selected
      if (!selectedMajors && !selectedSubjects) {
        alert("Please select at least one major or subject");
        return;
      }

      var url = 'query/?term=' + selectedTerm;
      //var url = 'http://www.cse.uaa.alaska.edu/sc/query/?term=' + selectedTerm + '&majors=' + selectedMajors;

      // add selected subjects to the URL if any are selected
      if (selectedMajors.length > 0) {
        url += '&majors=' + selectedMajors;
      }

      if (selectedSubjects.length > 0) {
        url += '&subjects=' + selectedSubjects;
      }

      const loadingContainer = document.getElementById('loading-container');
      // make an AJAX request to retrieve the major requirements
      var xhr = new XMLHttpRequest();
      loadingContainer.style.display = 'flex';
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
              const classes = JSON.parse(xhr.responseText);
              loadingContainer.style.display = 'none';

              class_array = JSON.parse(classes.data);
              //FIRST ITERATION OF CONFLICT CHECKING
              conflictFunction()

              // create the course blocks and assign
              for (let i = 0; i < class_array.length; i++) {
                const course = class_array[i];
                const courseElement = document.createElement('div');
                courseElement.classList.add('course-block');
                courseElement.setAttribute("draggable", "true");
                courseElement.setAttribute('CRN', course.CRN);
                courseElement.setAttribute('Subj', course.Subj);
                courseElement.setAttribute('Crs', course.Crs);
                courseElement.setAttribute('Sec', course.Sec);
                courseElement.setAttribute('Title', course.Title);
                courseElement.setAttribute('Days', course.Days);
                courseElement.setAttribute('STime', course.STime);
                courseElement.setAttribute('ETime', course.ETime);
                courseElement.setAttribute('Bldg', course.Bldg);
                courseElement.setAttribute('Room', course.Room);
                courseElement.setAttribute('Sdate', course.SDate);
                courseElement.setAttribute('Edate', course.EDate);
                courseElement.setAttribute('Instructor', course.Instructor);
                courseElement.setAttribute('DelMthd', course.DelMthd); 
                
                // add Subj and Crs data for block text
                const courseBlockText = document.createElement('div');
                courseBlockText.classList.add('course-text');
                courseBlockText.textContent = courseElement.getAttribute('Subj') + " " + courseElement.getAttribute('Crs');
                courseElement.appendChild(courseBlockText);
                
                // Add course element to time cell
                const days = courseElement.getAttribute('Days');
                const time = courseElement.getAttribute('STime');
                // figure this out, days == TBAW, TBAT, added to handle now
                if(days == "TBA" || days == "TBAM" || days == "TBAT" || days == "TBAW" || days == "TBAR" || days == "TBAF"){
                  const timeSlot = document.querySelector(`[data-day="TBA"]`);
                  console.log(timeSlot);
                  timeSlot.appendChild(courseElement);
                }
                else{
                  // split days and assign seperate course-blocks for each.
                  const daysArray = days.split('');
                  daysArray.forEach(day => {
                    const timeSlot = document.querySelector(`[data-day="${day}"][data-time="${time}"]`);
                    const duplicateCourseElement = courseElement.cloneNode(true);
                    timeSlot.appendChild(duplicateCourseElement);
                  });
                }
            };
            // drag events for course-block and time-cells
            const courseBlock = document.querySelector('.course-block');
          
            courseBlock.addEventListener('dragstart', (event) => {
              event.dataTransfer.setData('text/plain', 'course-block');
            });
            
            const timeCells = document.querySelectorAll('.time-cell');
            
            timeCells.forEach((timeCell) => {
              timeCell.addEventListener('dragover', (event) => {
                event.preventDefault();
                event.currentTarget.classList.add('highlight');
              });
            
              timeCell.addEventListener('dragleave', (event) => {
                event.currentTarget.classList.remove('highlight');
              });
            
              timeCell.addEventListener('drop', (event) => {
                event.preventDefault();
                const data = event.dataTransfer.getData('text/plain');
                if (data === 'course-block') {
                  const courseBlock = document.querySelector('.course-block');
                  const gridCell = event.currentTarget.parentNode;
                  const timeCell = event.currentTarget;
                  timeCell.appendChild(courseBlock);
                  timeCell.classList.remove('highlight');
                  gridCell.classList.remove('highlight');
                }
              });
            });
          }
      };
      console.log(url);
      xhr.open("GET", url, true);
      xhr.send();
  }

  // add a click event listener to the button
  var searchbtn = document.getElementById("search-btn");
  searchbtn.addEventListener('click', handleSearchButtonClick);
});


/////////////////////////////////////////////////////////////////////
//  THIS IS ALL THE CODE FOR THE FILTERING OPTIONS
//  DID NOT WANT TO ADD ANOTHER MODULE TO BE ABLE
//  TO PASS JS VARIABLES
//
/////////////////////////////////////////////////////////////////////


var filterVariables = {
  individualCourseConflicts: [],
  rangeCourseConflicts: [],
  ignoreCourses: [],
  ignoreSubjects: [],
  hideCourses: [],
  hideSubjects: [],
  corequisiteConflicts: []
};

function removeFilterVariable(element, type) {
  var item = $(element).parent().text().trim();
  var index = filterVariables[type].indexOf(item);
  filterVariables[type].splice(index, 1);
  $(element).parent().remove();
}

$(document).ready(function() {

      // Listen for keypress events on all input boxes in the form
  document.querySelectorAll('#advanced-filtering-content input').forEach(input => {
      input.addEventListener('keypress', event => {
      // If the pressed key is "Enter"
      if (event.key === 'Enter') {
          // Find the add button for the current section
          const addButton = event.target.parentNode.querySelector('button.add-button');
          // If there is an add button, click it
          if (addButton) {
          addButton.click();
          }
          // Otherwise, find the next input box and focus it
          else {
          const inputs = event.target.parentNode.querySelectorAll('input');
          const currentIndex = Array.from(inputs).indexOf(event.target);
          const nextInput = inputs[currentIndex + 1];
          if (nextInput) {
              nextInput.focus();
          }
          }
          // Prevent the default "Enter" behavior (submitting the form)
          event.preventDefault();
      }
      });
  });

$('#add-individual-class-conflict').click(function() {
  event.preventDefault(); // Prevent the default form submission behavior
  var inputBox1 = $('#conflict-1');
  var inputBox2 = $('#conflict-2');

  var course1 = inputBox1.val();
  var course2 = inputBox2.val();

  if ((course1.length >= 5 && course1.length <= 12) && (course2.length >= 5 && course2.length <= 12)) {
    var course_conflicts = filterVariables.individualCourseConflicts;

    // Sort the values alphabetically
    var sortedCourses = [course1, course2].sort();
    
    // Store the sorted values back into course1 and course2
    course1 = sortedCourses[0];
    course2 = sortedCourses[1];
    if (!filterVariables.individualCourseConflicts.some(tuple => tuple[0] === course1 && tuple[1] === course2)) {
      filterVariables.individualCourseConflicts.push([course1, course2]);
      var enteredIndividualCourseConflict = $('<div class="selected-item"><span class="remove-item" onclick="removeFilterVariable(this, \'individualCourseConflicts\')"></span><span>' + course1 + " " + course2 + '</span></div>');
      $('#entered-individual-course-conflict').append(enteredIndividualCourseConflict);
      inputBox1.val('');
      inputBox2.val('');
    }
  }
  else {
      alert("Check that course format is correct: \"CSCE A101\"");
      return;
  }
});

$('#add-range-class-conflict').click(function() {
  event.preventDefault(); // Prevent the default form submission behavior
  var inputBox1 = $('#range-subject');
  var inputBox2 = $('#range-start');
  var inputBox3 = $('#range-end');

  var inputSubject = inputBox1.val();
  var inputRangeStart = inputBox2.val();
  var inputRangeEnd = inputBox3.val();    

  if ((inputSubject.length >= 2 && inputSubject.length <= 4) && 
      (inputRangeStart.length >= 2 && inputRangeStart.length <= 4) && 
      (inputRangeEnd.length >= 2 && inputRangeEnd.length <= 4) &&
      (inputRangeEnd[0] == 'A') && (inputRangeStart[0] == 'A') &&
      (inputRangeStart.slice(1) < inputRangeEnd.slice(1))) {

      if (!filterVariables.rangeCourseConflicts.some(function(tuple) {
          return tuple[0] === inputSubject &&
                  tuple[1] === inputRangeStart &&
                  tuple[2] === inputRangeEnd;
      })) {
      filterVariables.rangeCourseConflicts.push([inputSubject, inputRangeStart, inputRangeEnd]);
      var enteredRangeCourseConflict = $('<div class="selected-item"><span class="remove-item" onclick="removeFilterVariable(this, \'rangeCourseConflicts\')"></span><span>' + inputSubject + " " + inputRangeStart + " - " + inputRangeEnd + '</span></div>');
      $('#entered-range-course-conflict').append(enteredRangeCourseConflict);
      inputBox1.val('');
      inputBox2.val('');
      inputBox3.val('');
    }
  }
  else {
      alert("Check that range format is correct: \"CSCE A101 - A201\"");
      return;
  }
});

$('#add-hide-class').click(function() {
  event.preventDefault(); // Prevent the default form submission behavior
  var inputBox1 = $('#hidden-class');

  var course = inputBox1.val();

  if (course.length >= 5 && course.length <= 12) {
      var hidden_courses = filterVariables.hideCourses;
      if (!hidden_courses.includes(course)) {
          filterVariables.hideCourses.push(course);
          var enteredHideClass = $('<div class="selected-item"><span class="remove-item" onclick="removeFilterVariable(this, \'hideCourses\')"></span><span>' + course + '</span></div>');
          $('#entered-hide-classes').append(enteredHideClass);
          inputBox1.val('');
      }
  }
  else {
      alert("Check that course format is correct. \"CSCE A101\"");
      return;
  }
});

$('#add-hide-subject').click(function() {
  event.preventDefault(); // Prevent the default form submission behavior
  var inputBox1 = $('#hidden-subject');

  var subject = inputBox1.val();

  if (subject.length >= 2 && subject.length <= 4) {
      var hidden_subjects = filterVariables.hideSubjects;
      if (!hidden_subjects.includes(subject)) {
          filterVariables.hideSubjects.push(subject);
          var enteredHideSubject = $('<div class="selected-item"><span class="remove-item" onclick="removeFilterVariable(this, \'hideSubjects\')"></span><span>' + subject + '</span></div>');
          $('#entered-hide-subjects').append(enteredHideSubject);
          inputBox1.val('');
      }
  }
  else {
      alert("Check that subject format is correct. e.g., \"CSCE\"");
      return;
  }
});

$('#add-ignore-class').click(function() {
  event.preventDefault(); // Prevent the default form submission behavior
  var inputBox1 = $('#ignore-class');

  var course = inputBox1.val();

  if (course.length >= 5 && course.length <= 12) {
      var ignore_courses = filterVariables.ignoreCourses;
      if (!ignore_courses.includes(course)) {
          filterVariables.ignoreCourses.push(course);
          var enteredIgnoreClass = $('<div class="selected-item"><span class="remove-item" onclick="removeFilterVariable(this, \'ignoreCourses\')"></span><span>' + course + '</span></div>');
          $('#entered-ignore-classes').append(enteredIgnoreClass);
          inputBox1.val('');
      }
  }
  else {
      alert("Check that course format is correct. \"CSCE A101\"");
      return;
  }
});

$('#add-ignore-subject').click(function() {
  event.preventDefault(); // Prevent the default form submission behavior
  var inputBox1 = $('#ignore-subject');

  var subject = inputBox1.val();

  if (subject.length >= 2 && subject.length <= 4) {
      var ignore_subjects = filterVariables.ignoreSubjects;
      if (!ignore_subjects.includes(subject)) {
          filterVariables.ignoreSubjects.push(subject);
          var enteredIgnoreSubject = $('<div class="selected-item"><span class="remove-item" onclick="removeFilterVariable(this, \'ignoreSubjects\')"></span><span>' + subject + '</span></div>');
          $('#entered-ignore-subjects').append(enteredIgnoreSubject);
          inputBox1.val('');
      }
  }
  else {
      alert("Check that subject format is correct. e.g., \"CSCE\"");
      return;
  }
});
});


window.addEventListener('load', function() {
  // Get the toggle button and the advanced filtering content element
  const toggleButton = document.querySelector("#toggle-advanced-filtering");
  const advancedFilteringContent = document.querySelector("#advanced-filtering-content");
  const dropdownArrows = document.querySelectorAll(".filter-dropdown-arrow");

  // Add an event listener to the toggle button
  toggleButton.addEventListener("click", function() {
    // Toggle the display property of the advanced filtering content element
    advancedFilteringContent.style.display = advancedFilteringContent.style.display === "block" ? "none" : "block";
    
    // Loop through each arrow element and toggle the 'active' class
    dropdownArrows.forEach(function(arrow) {
      arrow.classList.toggle("active");
    });
  });
});

/////////////////////////////////////////////////////////////////////
//  THIS IS ALL THE CODE FOR THE CONFLICT CHECKER
//  DID NOT WANT TO ADD ANOTHER MODULE TO BE ABLE
//  TO PASS JS VARIABLES
//
/////////////////////////////////////////////////////////////////////
let online_courses = [];
let unscheduled_courses = [];
let conflicts = [];
let ignored_courses = [];
let hidden_courses = [];
let course_hash_table = {};
let saved_data = false;
let saved_course_hash_table = {};
var saved_class_array = [];

const days = ["M", "T", "W", "R", "F"];
const time_slots = ["0830", "1000", "1130", "1300", "1430", "1600", "1730", "1900", "2030"];

// this just creates a hash table with the above information
function createHashTable(){
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    course_hash_table[day] = {};
    for (let j = 0; j < time_slots.length; j++) {
      const timeSlot = time_slots[j];
      course_hash_table[day][timeSlot] = [];
    }
  }
}

// Returns the timeslots of a specific class.  
// A class can return more than one time slot if its longer than the usual 1hr 15min
function getClassTimeSlots(startTime, endTime) {
  const course_time_slots = [];
  const start_slot_index = time_slots.findIndex(slot => slot >= startTime);
  const end_slot_index = time_slots.findIndex(slot => slot >= endTime);
  for (let i = start_slot_index; i < end_slot_index; i++) {
    course_time_slots.push(time_slots[i]);
  }
  return course_time_slots;
}

// adds class to the hashtable
function addToHashTable(course_object) {
  const time_slots = getClassTimeSlots(course_object.STime, course_object.ETime);
  // try and fix this, Im just limiting days to 2 to prevent errors
  for (let i = 0; i < course_object.Days.length; i++) {
    const day = course_object.Days[i];
    for (let j = 0; j < time_slots.length; j++) {
      const time_slot = time_slots[j];
      if (!(day in course_hash_table)) {
        console.log("day not found");
      }
      if (!(time_slot in course_hash_table[day])) {
        console.log("time not found");
      }
      course_hash_table[day][time_slot].push(course_object);
    }
  }
}


function isDuplicateConflict(course1_cnr, course2_crn) {
  for (let i = 0; i < conflicts.length; i++) {
    const conflict = conflicts[i];
    if ((conflict.course1_crn === course1_cnr && conflict.course2_crn === course2_crn) || 
        (conflict.course1_crn === course2_crn && conflict.course2_crn === course1_cnr)) {
      return true; // duplicate conflict found
    }
  }
  return false; // no duplicate conflict found
}


function isUndergradGrad(course1_crs, course2_crs) {
  const course1_number = extractNumberFromString(course1_crs)
  const course2_number = extractNumberFromString(course2_crs)
  if (((300 <= course1_number) && (course1_number <= 499)) && ((course2_number >= 600) && (course2_number <= 699)) ||
      ((300 <= course2_number) && (course2_number <= 499)) && ((course1_number >= 600) && (course1_number <= 699))) {
    if (Math.abs(course1_number - course2_number) === 200){
      return true; // undergrad graduate i.e., CSCE A405 and CSCE A605 are the same class
    }
  }
  return false; // not undergrad graduate 
}


function isCrossListed(course1_subj, course1_crs, course2_subj, course2_crs) {
  const course1_number = extractNumberFromString(course1_crs)
  const course2_number = extractNumberFromString(course2_crs)
  if ((course1_number === course2_number) && !(course1_subj === course2_subj)) {
    return true;
  }
  return false;
}

function extractNumberFromString(str) {
  const match = str.match(/\d+/); // match one or more digits
  return match ? parseInt(match[0]) : null; // convert the matched string to a number or return null if no match found
}


function addConflict(course1_object, course2_object, message){
  if (isDuplicateConflict(course1_object.CRN, course2_object.CRN)) {
    return;
  }
  if (isUndergradGrad(course1_object.Crs, course2_object.Crs)){
    return;
  }
  if (isCrossListed(course1_object.Subj, course1_object.Crs, course2_object.Subj, course2_object.Crs)){
    return;
  }
  else {
    conflicts.push({
      course1_crn: course1_object.CRN,
      course2_crn: course2_object.CRN,
      message: message
    });
  }
}


function checkForConflicts() {
  // Loop through each Day-Time in the hash table
  conflicts = [];
  for (const day in course_hash_table) {
    for (const time_slot in course_hash_table[day]) {
      const courses_in_slot = course_hash_table[day][time_slot];
      // Check for conflicts only if there is more than one class in this Day-Time slot
      if (courses_in_slot.length > 1) {
        // Check for conflicts between classes
        for (let i = 0; i < courses_in_slot.length; i++) {
          for (let j = i + 1; j < courses_in_slot.length; j++) {
            const course1 = courses_in_slot[i];
            const course2 = courses_in_slot[j];
            // Check if the instructors are the same
            if (course1.Instructor === course2.Instructor) {
              let message = `Conflict detected: ${course1.Title} and ${course2.Title} have the same instructor at ${day}-${time_slot}`;
              addConflict(course1, course2, message);
              continue;
            }
            // Check if the building and room are the same
             else if (course1.Bldg === course2.Bldg && course1.Room === course2.Room) {
              if (!(course1.Room == "ONLINE") && !(course1Bldg == "DIST")) {
                let message = `Conflict detected: ${course1.Title} and ${course2.Title} are in the same room at ${day}-${time_slot}`;
                addConflict(course1, course2, message);
                continue;
              }
            }
            // check for specified individual course conflicts in filter
            for (let conflict of filterVariables.individualCourseConflicts) {
              if (conflict.includes(course1.Subj + ' ' + course1.Crs) && conflict.includes(course2.Subj + ' ' + course2.Crs)) {
                let message = `Conflict detected: ${course1.Title} and ${course2.Title} cannot conflict (specified in filter) at ${day}-${time_slot}`;
                addConflict(course1, course2, message);
              }
            } 
            // check for range conflict in the filter
            for (let conflict of filterVariables.rangeCourseConflicts) {
              if (conflict[0] === course1.Subj && conflict[0] === course2.Subj &&
                extractNumberFromString(course1.Crs) >= extractNumberFromString(conflict[1]) && extractNumberFromString(course1.Crs) <= extractNumberFromString(conflict[2]) &&
                extractNumberFromString(course2.Crs) >= extractNumberFromString(conflict[1]) && extractNumberFromString(course2.Crs) <= extractNumberFromString(conflict[2])) {
                let message = `Conflict detected: ${course1.Title} and ${course2.Title} cannot conflict (range specified in filter) at ${day}-${time_slot}`;
                addConflict(course1, course2, message);
              }
            }       
          }
        }
      }
    }
  }
  for (let row of conflicts) {
    console.log(row);
  }
}


function conflictFunction() {
  // makes 2 new arrays
  // classArray for displaying on the calendar
  // onlineClasses for disn=playing somewhere (no time or place)
  // uncheduledClasses for a staging area
  for (let i = 0; i < class_array.length; i++) {
    const row = class_array[i];
    if (row.DelMthd === "ONLINE") {
      online_courses.push(row);
      class_array.splice(i, 1); // remove the row from classArray
      i--; // decrement i to account for the removed row
    } else if (row.Days === "TBA" || row.STime === "TBA" || row.ETime === "TBA") {
      unscheduled_courses.push(row);
      class_array.splice(i, 1); // remove the row from classArray
      i--; // decrement i to account for the removed row
    }
  }
  // initializes the hashtable
  createHashTable();
  // adds the courses to the hash table
  for (let i = 0; i < class_array.length; i++) {
    addToHashTable(class_array[i]);
  }
  if (!saved_data) {
    console.log("saving hash table")
    saved_course_hash_table = JSON.parse(JSON.stringify(course_hash_table));
    saved_data = true;
  }
  checkForConflicts();
}


function removeHiddenCourses() {
  // Remove hidden courses from classArray
  console.log("Hiding courses:")
  console.log(filterVariables.hideCourses)
  class_array = class_array.filter((course) => {
    return !(filterVariables.hideCourses.includes(course.Subj + ' ' + course.Crn));
  });
  // Remove hidden courses from course_hash_table
  for (let day in course_hash_table) {
    for (let timeSlot in course_hash_table[day]) {
      course_hash_table[day][timeSlot] = course_hash_table[day][timeSlot].filter((course) => {
        return !(filterVariables.hideCourses.includes(course.Subj + ' ' + course.Crn));
      });
    }
  }
}


function removeHiddenSubjects() {
  console.log("Hiding subjects:")
  console.log(filterVariables.hideSubjects)
  // Remove hidden subjects from classArray
  class_array = class_array.filter((course) => {
    return !filterVariables.hideSubjects.includes(course.Subj);
  });
  // Remove hidden subjects from course_hash_table
  for (let day in course_hash_table) {
    for (let timeSlot in course_hash_table[day]) {
      course_hash_table[day][timeSlot] = course_hash_table[day][timeSlot].filter((course) => {
        return !filterVariables.hideSubjects.includes(course.Subj);
      });
    }
  }
}


function removeIgnoreCourses(){
  console.log("Ignoring courses:")
  console.log(filterVariables.ignoreCourses)
  // Remove hidden courses from course_hash_table
  for (let day in course_hash_table) {
    for (let timeSlot in course_hash_table[day]) {
      course_hash_table[day][timeSlot] = course_hash_table[day][timeSlot].filter((course) => {
        return !(filterVariables.ignoreCourses.includes(course.Subj + ' ' + course.Crn));
      });
    }
  }
}


function removeIgnoreSubjects() {
  console.log("Ignoring subjects:")
  console.log(filterVariables.ignoreSubjects)
  // Remove ignore subjects from course_hash_table
  for (let day in course_hash_table) {
    for (let timeSlot in course_hash_table[day]) {
      course_hash_table[day][timeSlot] = course_hash_table[day][timeSlot].filter((course) => {
        return !filterVariables.ignoreSubjects.includes(course.Subj);
      });
    }
  }
}


window.addEventListener('load', function() {
  // define a function to handle the button press
  function handleFilterButtonClick() {
    class_array = JSON.parse(JSON.stringify(saved_class_array));
    console.log("In use hash table:")
    console.log(class_array)
    console.log("Saved hash table:")
    console.log(saved_class_array)
    course_hash_table = JSON.parse(JSON.stringify(saved_course_hash_table))
    console.log("In use hash table:")
    console.log(course_hash_table)
    console.log("Saved hash table:")
    console.log(saved_course_hash_table)
    console.log("Filtering individual conflicts:")
    console.log(filterVariables.individualCourseConflicts)
    console.log("Filtering range conflicts:")
    console.log(filterVariables.rangeCourseConflicts)
    removeHiddenCourses();
    removeHiddenSubjects();
    removeIgnoreCourses();
    removeIgnoreSubjects();
    checkForConflicts();
  }

  // add a click event listener to the button
  var filterbtn = document.getElementById("apply-filter");
  filterbtn.addEventListener('click', handleFilterButtonClick);
});