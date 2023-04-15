window.classes = {}

var selectedItems = {
  majors: [],
  subjects: []
};

var class_array = []

function removeItem(element, type, id) {
  var item = $(element).parent().text().trim();
  var index = selectedItems[type].indexOf(item);
  selectedItems[type].splice(index, 1);
  $(element).parent().remove();
  // Remove the class from the corresponding option in the dropdown
  $(id + ' option').filter(function() {
    return $(this).text() === item;
  }).removeClass('selected').css('background-color', '').css('color', '');
  
  // Force set background color to white and text color to black for the removed option
  $(id + ' option').filter(function() {
    return $(this).text() === item;
  }).css('background-color', 'white').css('color', 'black');
}


$(document).ready(function() {

  $('#major-dropdown-toggle').click(function() {
    event.stopPropagation();
    $('#major-dropdown').toggle();
  });

  $('#major-dropdown').change(function() {
    $(this).find('option:selected').css('background-color', '#007bff').css('color', 'white');
    var selectedMajor = $(this).val();
    if (selectedMajor[0] !== '') {
      if (/^[^-]+-\s*[^-]+$/.test(selectedMajor)) { // Check if the option matches the format "?? - ????????"
        var majors = selectedItems.majors;
        if (!majors.includes(selectedMajor[0])) {
          majors.push(selectedMajor[0]);
          var selectedItem = $('<div class="selected-item"><span class="remove-item" onclick="removeItem(this, \'majors\', \'#major-dropdown\')"></span><span>' + selectedMajor + '</span></div>');
          $('#selected-majors').append(selectedItem);
          $(this).val('');
        }
      }
      $(this).val('');
    }
  });
  
  $(document).click(function(event) {
    if (!$(event.target).closest('.dropdown-wrapper').length && !$(event.target).hasClass('remove-item')) {
      $('#major-dropdown').hide();
      $('#subject-dropdown').hide();
      $('#instructor-dropdown').hide();
      $('#bldg-dropdown').hide();
      $('#room-dropdown').hide();
    }
  });
  
  $('.dropdown-btn').click(function() {
    var dropdown = $(this).next('.dropdown-wrapper');
    $('.dropdown-wrapper').not(dropdown).hide(); // hide all other dropdowns
    dropdown.toggle();
  });
  
  
  
  $('#subject-dropdown-toggle').click(function() {
    event.stopPropagation();
    $('#subject-dropdown').toggle();
  });

  $('#subject-dropdown').change(function() {
    $(this).find('option:selected').css('background-color', '#007bff').css('color', 'white');
    var selectedSubject = $(this).val();
    if (selectedSubject[0] !== '') {
      if (/^[^-]+-\s*[^-]+$/.test(selectedSubject)) { // Check if the option matches the format "?? - ????????"
        var subjects = selectedItems.subjects;
        if (!subjects.includes(selectedSubject[0])) {
          subjects.push(selectedSubject[0]);
          var selectedItem = $('<div class="selected-item"><span class="remove-item" onclick="removeItem(this, \'subjects\', \'#subject-dropdown\')"></span><span>' + selectedSubject + '</span></div>');
          $('#selected-subjects').append(selectedItem);
          $(this).val('');
        }
      }
      $(this).val('');
    }
  });

  $('#semester-select').change(function() {
    var selectedSemester = $(this).val();
  });
});



// Define a function to populate the instructors dropdown and register the event handlers
function populateInstructorsDropdown() {
  // Populating the instructors dropdown with unique professor names
  var instructors = [];
  for (var i = 0; i < saved_class_array.length; i++) {
    var instructor = saved_class_array[i].Instructor;
    if (!instructors.includes(instructor)) {
      instructors.push(instructor);
    }
  }
  
  // Sort the instructor names alphabetically
  instructors.sort();
  var selectAllOption = $('<option></option>').attr('value', 'All Instructors').addClass('bold').text('Select All');
  $('#instructor-dropdown').append(selectAllOption);
  // Add the options to the dropdown
  for (var i = 0; i < instructors.length; i++) {
    var option = $('<option></option>').text(instructors[i]);
    $('#instructor-dropdown').append(option);
  }
  

  // Adding click event to toggle the dropdown
  $('#instructor-dropdown-toggle').click(function(event) {
    event.stopPropagation();
    $('#instructor-dropdown').toggle();
  });

  // Adding change event to add selected item to selected items list
  $('#instructor-dropdown').change(function() {
    $(this).find('option:selected').css('background-color', '#007bff').css('color', 'white');
    var selectedInstructor = $(this).val();
    if (selectedInstructor[0] !== '') {
      if (/^\S+\s+\S+$/.test(selectedInstructor[0])) {
        var instructors = filterVariables.instructors;
        if (!instructors.includes(selectedInstructor[0])) {
          var selectedItem = $('<div class="selected-item"><span class="remove-item" onclick="removeFilterVariable(this, \'instructors\', \'#instructor-dropdown\')"></span><span>' + selectedInstructor + '</span></div>');
          $('#selected-instructors').append(selectedItem);
          filterVariables.instructors.push(selectedInstructor[0]);
          $(this).val('');
        }
      }
      $(this).val('');
    }
  });
}
// Define a function to populate the buildings dropdown and register the event handlers
function populateBuildingsDropdown() {
  // Populating the buildings dropdown with unique building names
  var buildings = [];
  for (var i = 0; i < saved_class_array.length; i++) {
    var building = saved_class_array[i].Bldg;
    if (!buildings.includes(building)) {
      buildings.push(building);
    }
  }

  buildings.sort(); // sort the building names alphabetically

  for (var i = 0; i < buildings.length; i++) {
    var option = $('<option></option>').text(buildings[i]);
    $('#bldg-dropdown').append(option);
  }


  // Adding click event to toggle the dropdown
  $('#bldg-dropdown-toggle').click(function(event) {
    event.stopPropagation();
    $('#bldg-dropdown').toggle();
  });

  $('#bldg-dropdown').change(function() {    
    $('#room-dropdown').hide();
    $('#bldg-dropdown option').css('background-color', '').css('color', '');

    $(this).find('option:selected').css('background-color', '#007bff').css('color', 'white');
    console.log(saved_class_array)
    var selectedBldg = $(this).val();
    if (selectedBldg[0] !== '') {
      if (/^\S+$/.test(selectedBldg[0])) {
        // Clearing the options in the room dropdown
        $('#room-dropdown').empty();
        var selectAllOption = $('<option></option>').attr('value', 'Select All').addClass('bold').text('Select All');
        $('#room-dropdown').append(selectAllOption);
        // Filtering the class_array to find unique rooms for the selected building
        // Filtering the class_array to find unique rooms for the selected building
        var rooms = [];
        var selectedBldgRooms = saved_class_array.filter(function(c) {
          return c.Bldg === selectedBldg[0];
        }).forEach(function(c) {
          if (!rooms.includes(c.Room.toString())) {
            rooms.push(c.Room.toString());
          }
        });
        
        rooms.sort(); // Sort the rooms array
        
        // Add options to #room-dropdown
        for (var i = 0; i < rooms.length; i++) {
          var option = $('<option></option>').text(rooms[i]);
          $('#room-dropdown').append(option);
        }
        
        
        $('#room-dropdown').toggle(); // Open room dropdown
  
        // Adding change event to add selected item to selected items list
        $('#room-dropdown').off('change').on('change', function() {
          $(this).find('option:selected').css('background-color', '#007bff').css('color', 'white');
          var selectedRoom = $(this).val();

          if (selectedRoom[0] !== '') {
            if (/^\S+$/.test(selectedRoom[0])) {
              var selectedItemText = selectedBldg[0] + ' ' + selectedRoom[0];
              var bldgRooms = filterVariables.bldgRoom;
              if (!bldgRooms.includes(selectedItemText)) {
                var selectedItem = $('<div class="selected-item"><span class="remove-item" onclick="removeFilterVariable(this, \'bldgRoom\', \'#room-dropdown\')"></span><span>' + selectedItemText + '</span></div>');
                $('#selected-items').append(selectedItem);
                filterVariables.bldgRoom.push(selectedItemText);
              }
            }
            else if (selectedRoom[0] === 'Select All') {
              selectedItem = $('<div class="selected-item"><span class="remove-item" onclick="removeFilterVariable(this, \'bldgRoom\', \'#room-dropdown\')"></span><span>' + selectedBldg[0] + '</span></div>');
              $('#selected-items').append(selectedItem);
              filterVariables.bldgRoom.push(selectedBldg[0]);
            }
            $(this).val('');
          }
        });
        $(this).val('');
      }
      $(this).val('');
    }
  });  
}



function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    // const data = new Uint8Array(event.target.result);
    // const workbook = XLSX.read(data, { type: 'array' });
    // const sheetName = workbook.SheetNames[0];
    // const worksheet = workbook.Sheets[sheetName];
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
      

// Loop through the first row (header row)
    for (let cell in worksheet) {
      const cellRef = XLSX.utils.decode_cell(cell);
      if (cellRef.r === 0 && worksheet[cell].v === 'Del Mthd') {
        worksheet[cell].v = 'DelMthd';
        break;
      }
    }
    const contents = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    const selectedColumns = ['CRN', 'Subj Crs Sec', 'Title', 'Days', 'STime', 'ETime', 'Bldg', 'Room', 'Instructor', 'DelMthd'];
    const columnIndices = selectedColumns.map(col => Object.values(contents[0]).indexOf(col));
    const missingColumns = selectedColumns.filter(col => !Object.values(contents[0]).includes(col));
    if (missingColumns.length > 0) {
      const downloadLink = "https://curric.uaa.alaska.edu/scheduleSearch.php";
      alert(`The Excel file was not recognized. Please download a new file from ${downloadLink}.`);
      return; // Stop the function
    }
    

    const newData = contents.slice(1).map(row => selectedColumns.reduce((acc, col, index) => {
      if (col === 'Subj Crs Sec') {
        const [subj, crs, sec] = row[columnIndices[index]].split(' ');
        return { ...acc, Subj: subj, Crs: crs, Sec: sec };
      }
      let cellValue = row[columnIndices[index]];
      if (typeof cellValue === 'string' && cellValue.includes('\r\n')) {
        cellValue = cellValue.replace(/\r\n$/, ''); // Remove trailing \r\n
        cellValue = cellValue.replace(/\r\n/g, ', '); // Replace remaining \r\n with ', '
        cellValue = cellValue.split(', '); // Convert cellValue into an array of values
        cellValue = cellValue.length === 1 ? cellValue[0] : cellValue.join(', ');
      }
      if (typeof cellValue === 'string' && cellValue.includes('\n')) {
        cellValue = cellValue.replace(/\n$/, ''); // Remove trailing \n
        cellValue = cellValue.replace(/\n/g, ', '); // Replace remaining \n with ', '
        cellValue = cellValue.split(', '); // Convert cellValue into an array of values
        cellValue = cellValue.length === 1 ? cellValue[0] : cellValue.join(', ');
      }
      if (typeof cellValue === 'string' && cellValue.includes(', ')) {
        cellValue = cellValue.split(', '); // Convert cellValue into an array of values
        cellValue = cellValue.length === 1 ? cellValue[0] : cellValue;
      }
    
      return { ...acc, [col]: cellValue };
    }, {}));
    

    class_array = newData.map(row => {
      const [days, stime, etime, bldg, room] = narrowDown(row);
      return { ...row, Days: days, STime: parse_time(stime), ETime: parse_time(etime), Bldg: bldg, Room: room };
    });

    saved_class_array = [...class_array];
    console.log(saved_class_array);
    populateInstructorsDropdown();
    populateBuildingsDropdown();
    conflictFunction()

  };

  reader.readAsArrayBuffer(file);
}


function narrowDown(row) {
  if (Array.isArray(row['Days'])) {
    let scores = row['Days'].map((_, i) => {
      let score = 0;
      if (row['Days'][i] === 'TBA') {
        score += 1;
      }
      if (row['STime'][i] === 'TBA') {
        score += 1;
      }
      if (row['ETime'][i] === 'TBA') {
        score += 1;
      }
      if (row['Bldg'][i] === 'DIST') {
        score += 1;
      }
      if (row['Room'][i] === 'ONLINE' || row['Room'][i] === 'BLKBD') {
        score += 1;
      }
      return score;
    });
    let index = scores.indexOf(Math.min(...scores));
    let days = row['Days'][index];
    let stime = row['STime'][index];
    let etime = row['ETime'][index];
    let bldg = row['Bldg'][index];
    let room = row['Room'][index];
    return [days, stime, etime, bldg, room];
  } else {
    return [row['Days'], row['STime'], row['ETime'], row['Bldg'], row['Room']];
  }
}

function parse_time(time_str) {
  if (Array.isArray(time_str)) {
    return time_str.map(t => parse_time(t));
  } else if (time_str.length === 6) {
    let hours = parseInt(time_str.substring(0, 2));
    const minutes = parseInt(time_str.substring(2, 4));
    const meridian = time_str.substring(4).toUpperCase();
    if (meridian === 'PM' && hours !== 12) {
      hours += 12;
    } else if (meridian === 'AM' && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;
  } else {
    return time_str;
  }
}




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

      // var url = '/sc/query/?term=' + selectedTerm;
      var url = '/query/?term=' + selectedTerm;


      // add selected subjects to the URL if any are selected
      if (selectedMajors.length > 0) {
        url += '&majors=' + selectedMajors;
      }

      if (selectedSubjects.length > 0) {
        url += '&subjects=' + selectedSubjects;
      }

      const loadingContainer = document.getElementById('loading-search-container');
      // make an AJAX request to retrieve the major requirements
      var xhr = new XMLHttpRequest();
      loadingContainer.style.display = 'flex';
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
              const classes = JSON.parse(xhr.responseText);
              loadingContainer.style.display = 'none';

              class_array = JSON.parse(classes.data);
              saved_class_array = [...class_array];
              console.log(saved_class_array);
              populateInstructorsDropdown();
              populateBuildingsDropdown();
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
  corequisiteConflicts: [],
  instructors: [],
  bldgRoom: []
};

function removeFilterVariable(element, type, id) {
  var item = $(element).parent().text().trim();
  var index = filterVariables[type].indexOf(item);
  filterVariables[type].splice(index, 1);
  $(element).parent().remove();
  // Remove the class from the corresponding option in the dropdown
  $(id + ' option').filter(function() {
    return $(this).text() === item;
  }).removeClass('selected').css('background-color', '').css('color', '');
  
  // Force set background color to white and text color to black for the removed option
  $(id + ' option').filter(function() {
    return $(this).text() === item;
  }).css('background-color', 'white').css('color', 'black');
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
        console.log(day)

      }
      if (!(time_slot in course_hash_table[day])) {
        console.log("time not found");
        console.log(time_slot)
      }
      course_hash_table[day][time_slot].push(course_object);
    }
  }
}


function isDuplicateConflict(course1_crn, course2_crn) {
  for (let i = 0; i < conflicts.length; i++) {
    const conflict = conflicts[i];
    if ((conflict.course1.CRN === course1_crn && conflict.course2.CRN === course2_crn) || 
        (conflict.course1.CRN === course2_crn && conflict.course2.CRN === course1_crn)) {
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
  else if (isUndergradGrad(course1_object.Crs, course2_object.Crs)){
    return;
  }
  else if (isCrossListed(course1_object.Subj, course1_object.Crs, course2_object.Subj, course2_object.Crs)){
    return;
  }
  else {
    conflicts.push({
      course1: course1_object,
      course2: course2_object,
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
              let message = `have the same instructor: ${course1.Instructor}`;
              addConflict(course1, course2, message);
              continue;
            }
            // Check if the building and room are the same
             else if (course1.Bldg === course2.Bldg && course1.Room === course2.Room) {
              if (!(course1.Room == "ONLINE") && !(course1Bldg == "DIST")) {
                let message = `are in the same room: ${course1.Bldg} ${course1.Room}`;
                addConflict(course1, course2, message);
                continue;
              }
            }
            // check for specified individual course conflicts in filter
            for (let conflict of filterVariables.individualCourseConflicts) {
              if (conflict.includes(course1.Subj + ' ' + course1.Crs) && conflict.includes(course2.Subj + ' ' + course2.Crs)) {
                let message = `cannot conflict, specified in filter`;
                addConflict(course1, course2, message);
              }
            } 
            // check for range conflict in the filter
            for (let conflict of filterVariables.rangeCourseConflicts) {
              if (conflict[0] === course1.Subj && conflict[0] === course2.Subj &&
                extractNumberFromString(course1.Crs) >= extractNumberFromString(conflict[1]) && extractNumberFromString(course1.Crs) <= extractNumberFromString(conflict[2]) &&
                extractNumberFromString(course2.Crs) >= extractNumberFromString(conflict[1]) && extractNumberFromString(course2.Crs) <= extractNumberFromString(conflict[2])) {
                let message = `cannot conflict, specified in filter`;
                addConflict(course1, course2, message);
              }
            }       
          }
        }
      }
    }
  }
  displayConflicts()
  for (let row of conflicts) {
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
  displayOnlineCourses()
  // initializes the hashtable
  createHashTable();
  // adds the courses to the hash table
  for (let i = 0; i < class_array.length; i++) {
    addToHashTable(class_array[i]);
  }
  if (!saved_data) {
    saved_course_hash_table = JSON.parse(JSON.stringify(course_hash_table));
    console.log("ORIGINAL SAVE")
    console.log(saved_course_hash_table)
    saved_data = true;
  }
  checkForConflicts();
}


function removeHiddenCourses() {
  // Remove hidden courses from classArray
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
  // Remove ignore subjects from course_hash_table
  for (let day in course_hash_table) {
    for (let timeSlot in course_hash_table[day]) {
      course_hash_table[day][timeSlot] = course_hash_table[day][timeSlot].filter((course) => {
        return !filterVariables.ignoreSubjects.includes(course.Subj);
      });
    }
  }
}

function displayInstructors() {
  // Check if the filter includes "All Instructors"
  if (filterVariables.instructors.length === 0) {
    return;
  }
  if (filterVariables.instructors.includes("All Instructors")) {
    return;
  } 
  else {
    for (let day in course_hash_table) {
      for (let timeSlot in course_hash_table[day]) {
        course_hash_table[day][timeSlot] = course_hash_table[day][timeSlot].filter((course) => {
          return filterVariables.instructors.includes(course.Instructor);
        });
      }
    }
  }
}

function displayBldgRoom() {
  console.log("Displaying building and room information:");

  if (filterVariables.bldgRoom.length === 0) {
    return;
  }
  
  else {
    for (let day in course_hash_table) {
      for (let timeSlot in course_hash_table[day]) {
        course_hash_table[day][timeSlot] = course_hash_table[day][timeSlot].filter((course) => {
          return (filterVariables.bldgRoom.includes(course.Bldg) || filterVariables.bldgRoom.includes(course.Bldg + ' ' + course.Room));
        });
      }
    }
  }
  
  console.log(course_hash_table); // Display filtered courses
}

window.addEventListener('load', function() {
  // define a function to handle the button press
  function handleFilterButtonClick() {

    const loadingContainer = document.getElementById('loading-filtering-container');
    loadingContainer.style.display = 'flex';
    course_hash_table = JSON.parse(JSON.stringify(saved_course_hash_table));
    console.log(course_hash_table)
    console.log(saved_course_hash_table)

    removeHiddenCourses();
    removeHiddenSubjects();
    removeIgnoreCourses();
    removeIgnoreSubjects();
    displayInstructors();
    displayBldgRoom();
    checkForConflicts();
    setTimeout(function() {
      loadingContainer.style.display = 'none';;
    }, 300);

  }

  // add a click event listener to the button
  var filterbtn = document.getElementById("apply-filter");
  filterbtn.addEventListener('click', handleFilterButtonClick);
});




////////////////////////////////////////////////////////////////////
//  JS for displaying the conflicts
//  within a conflict box
////////////////////////////////////////////////////////////////////
function displayConflicts() {
  var conflictsList = document.getElementById("conflict-container");
  conflictsList.innerHTML = "";

  // add the header again
  var header = document.createElement("h2");
  header.innerText = "Detected Conflicts:";
  conflictsList.appendChild(header);

  for (var i = 0; i < conflicts.length; i++) {
    (function(conflict) {
      var conflictMessage = conflict.message;
      var course1 = conflict.course1;
      var course2 = conflict.course2;

      var conflictBox = document.createElement("div");
      conflictBox.classList.add("conflict-item");

      var coursesElem = document.createElement("div");
      coursesElem.classList.add("conflict-courses");
      coursesElem.innerHTML = '<span class="course1">' + course1.Subj + ' ' + course1.Crs + ' <span class="course1-sec">' + course1.Sec + '</span> &' + '</span>  <span class="course2">' + course2.Subj + ' ' + course2.Crs + ' <span class="course2-sec">' + course2.Sec + '</span></span>';
      conflictBox.appendChild(coursesElem);

      var conflictMessageElem = document.createElement("div");
      conflictMessageElem.classList.add("conflict-message");
      conflictMessageElem.innerText = conflictMessage;
      conflictBox.appendChild(conflictMessageElem);

      // add event listener to each conflict item
      conflictBox.addEventListener("click", function() {
        showConflictDetails(conflict, conflictBox);
      });

      conflictsList.appendChild(conflictBox);
    })(conflicts[i]);
  }
}

function militaryToStandardTime(timeString) {
  var militaryHours = parseInt(timeString.slice(0,2));
  var militaryMinutes = timeString.slice(2);
  var standardHours = militaryHours % 12 || 12;
  var standardMinutes = parseInt(militaryMinutes);
  var meridiem = militaryHours < 12 || militaryHours === 24 ? "AM" : "PM";
  return standardHours + ":" + (standardMinutes < 10 ? "0" : "") + standardMinutes + meridiem;
}


function showConflictDetails(conflict, clickedElement) {
  // get the courses and conflict message
  var course1 = conflict.course1;
  var course2 = conflict.course2;
  var conflictMessage = conflict.message;

  // create temporary conflict box and set content
  var tempConflictBox = document.createElement("div");
  tempConflictBox.id = "temp-conflict-box";
  tempConflictBox.innerHTML = '<div class="col-container">' +
  '<div class="col">' +
  '<h4>' + course1.Subj + ' ' + course1.Crs + ' ' + course1.Sec + '</h4>' +
  '<p>' + course1.Title + '</p>' +
  '<p>' + 'CRN: ' + course1.CRN + '</p>' +
  '<p>' + 'Instructor: ' + course1.Instructor + '</p>' +
  '<p>' + 'Days: ' + course1.Days + '</p>' +
  '<p>' + militaryToStandardTime(course1.STime) + '-' + militaryToStandardTime(course1.ETime) + '</p>' +
  '<p>' + 'Location: ' + course1.Bldg + ' ' + course1.Room + '</p>' +
  '</div>' +
  '<div class="col">' +
  '<h4>' + course2.Subj + ' ' + course2.Crs + ' ' + course2.Sec + '</h4>' +
  '<p>' + course2.Title + '</p>' +
  '<p>' + 'CRN: ' + course2.CRN + '</p>' +
  '<p>' + 'Instructor: ' + course2.Instructor + '</p>' +
  '<p>' + 'Days: ' + course2.Days + '</p>' +
  '<p>' + militaryToStandardTime(course2.STime) + '-' + militaryToStandardTime(course2.ETime) + '</p>' +
  '<p>' + 'Location: ' + course2.Bldg + ' ' + course2.Room + '</p>' +
  '</div>' +
  '</div>' +
  '<div class="conflict-message">' + 'These courses ' + conflictMessage + '</div>';

  // append temporary conflict box to body
  var container = document.getElementById("temp-conflict-container");
  container.appendChild(tempConflictBox);

  // var clickedRect = clickedElement.getBoundingClientRect();
  // var clickedTop = clickedRect.top;
  // var boxTop = clickedTop + clickedElement.offsetHeight;
  // tempConflictBox.style.top = boxTop + "px";


  var parentContainer = clickedElement.parentNode.getBoundingClientRect();
  var clickedRect = clickedElement.getBoundingClientRect();
  var clickedTop = clickedRect.top - parentContainer.top;
  var boxTop = clickedTop + clickedElement.offsetHeight + 230;
  tempConflictBox.style.top = boxTop + "px";

  // make the temporary conflict box visible
  tempConflictBox.style.display = "block";
  setTimeout(function() {
    document.addEventListener("click", closeConflictDetails);
  }, 10);
}


// function to close temporary conflict box
function closeConflictDetails(event) {
  var tempConflictBox = document.getElementById("temp-conflict-box");
  if (tempConflictBox && !tempConflictBox.contains(event.target)) {
    tempConflictBox.parentNode.removeChild(tempConflictBox);
    document.removeEventListener("click", closeConflictDetails);
  }
}



function displayOnlineCourses() {
 
  // Create course tiles for each online course and append them to the "course-tiles" container
  const courseTilesContainer = document.querySelector(".course-tiles");
  online_courses.forEach(course => {
    const courseTile = document.createElement("div");
    courseTile.classList.add("course-tile");
  
    const crn = document.createElement("p");
    const title = document.createElement("p");
    const courseInfo = document.createElement("p");
    courseInfo.textContent = `${course.Subj} ${course.Crs} ${course.Sec}`;
    courseTile.appendChild(courseInfo);

    title.textContent = `${course.Title}`;
    courseTile.appendChild(title);

  
    crn.textContent = `CRN: ${course.CRN}`;
    courseTile.appendChild(crn);

    const instructor = document.createElement("p");
    instructor.textContent = `Instructor: ${course.Instructor}`;
    courseTile.appendChild(instructor);
  
    courseTilesContainer.appendChild(courseTile);
  });
}
// Toggle the online courses section visibility
function toggleOnlineCourses() {
  const onlineCoursesSection = document.querySelector('.online-courses');
  const toggleButton = document.querySelector('.toggle-online-courses-button');
  onlineCoursesSection.classList.toggle('show');
  toggleButton.textContent = onlineCoursesSection.classList.contains('show') ? 'Hide' : 'Show';
}
