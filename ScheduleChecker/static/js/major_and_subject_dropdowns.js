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
              //////////////////////////////////////////////////////////////////////////////////
              //THIS IS WHERE THE CLASS DF JSON IS
              //////////////////////////////////////////////////////////////////////////////////
              classes = JSON.parse(xhr.responseText);




              console.log(classes);


              classes.forEach(course => {
                const courseElement = document.createElement('div');
                courseElement.classList.add('course-block');
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
                courseElement.setAttribute('DelMthd', course.DelMthd); // removed whitepsace
                
                // add Subj and Crs data for block text
                const courseBlockText = document.createElement('div');
                courseBlockText.classList.add('course-text');
                courseBlockText.textContent = courseElement.getAttribute('Subj') + " " + courseElement.getAttribute('Crs');
                courseElement.appendChild(courseBlockText);
          
                // Add drag and drop listeners
                courseElement.addEventListener('dragstart', e => {
                  e.dataTransfer.setData('text/plain', course.Subj);
                });
          
                courseElement.addEventListener('dragover', e => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  const target = e.target;
                  target.classList.add('highlight');
                });
          
                courseElement.addEventListener('dragleave', e => {
                  e.preventDefault();
                  const target = e.target;
                  target.classList.remove('highlight');
                });
          
                courseElement.addEventListener('drop', e => {
                  e.preventDefault();
                  const target = e.target;
                  target.classList.remove('highlight');
                  const subject = e.dataTransfer.getData('text/plain');
                  const startTime = target.getAttribute('data-time');
                  const day = target.getAttribute('data-day');
                  // Update course object start time
                  courseElement.setAttribute('STime', startTime);
                });
          
                // Add course element to time cell
                const day = courseElement.getAttribute('Days');
                const time = courseElement.getAttribute('STime');
                const timeSlot = document.querySelector(`[data-day="${day}"][data-time="${time}"]`);
                timeSlot.appendChild(courseElement);
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