window.classes = {}

var selectedItems = {
  majors: [],
  subjects: []
};

function removeItem(element, type) {
  var item = $(element).parent().text().trim();
  var index = selectedItems[type].indexOf(item);
  selectedItems[type].splice(index, 1);
  $(element).parent().remove();
}



$(document).ready(function() {
  $('#major-dropdown').change(function() {
    console.log('Major dropdown changed');
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
    console.log('Subject dropdown changed');
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
    console.log('Semester dropdown changed');
    var selectedSemester = $(this).val();
    if (selectedSemester !== '') {
      console.log(selectedSemester);
    }
  });
});


window.addEventListener('load', function() {
  // define a function to handle the button press
  function handleButtonClick() {

      var selectedTerm = $('#semester-select').val();

      // check if a term is selected
      if (!selectedTerm) {
          alert("Please select a term.");
          return;
      }

      // get the selected majors from the dropdown
      var selectedMajors = $('#selected-majors .selected-item span:nth-child(2)').map(function() {
          return $(this).text();
      }).get().join(",");

      // check if at least one major is selected
      if (!selectedMajors) {
          alert("Please select at least one major.");
          return;
      }

      // get the selected subjects from the dropdown
      var selectedSubjects = $('#selected-subjects .selected-item span:nth-child(2)').map(function() {
          return $(this).text();
      }).get().join(",");


      var url = 'query/?term=' + selectedTerm + '&majors=' + selectedMajors;

      // add selected subjects to the URL if any are selected
      if (selectedSubjects) {
          url += '&subjects=' + selectedSubjects;
      }

      // make an AJAX request to retrieve the major requirements
      // make an AJAX request to retrieve the major requirements
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
              // handle the response here
              //THIS IS WHERE THE CLASS DF JSON IS
              const classes = JSON.parse(xhr.responseText);
              const classArray = JSON.parse(classes.data);
              
              // create the course blocks and assign
              for (let i = 0; i < classArray.length; i++) {
                const course = classArray[i];
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
      xhr.open("GET", url, true);
      xhr.send();
  }

  // add a click event listener to the button
  var searchbtn = document.getElementById("search-btn");
  searchbtn.addEventListener('click', handleButtonClick);
});