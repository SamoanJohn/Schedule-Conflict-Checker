var selectedItems = {
  majors: [],
  subjects: []
};

var filterVariables = {
  individualCourseConflicts: [],
  rangeCourseConflicts: [],
  ignoreCourses: [],
  ignoreSubjects: [],
  hideCourses: [],
  hideSubjects: [],
  corequisiteConflicts: []
};


function removeItem(element, type) {
  var item = $(element).parent().text().trim();
  var index = selectedItems[type].indexOf(item);
  selectedItems[type].splice(index, 1);
  $(element).parent().remove();
}

function removeFilterVariable(element, type) {
  var item = $(element).parent().text().trim();
  var index = selectedItems[type].indexOf(item);
  filterVariables[type].splice(index, 1);
  $(element).parent().remove();
}

$(document).ready(function() {
  console.log('JavaScript file loaded and executed!');

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

  $('#add-individual-class-conflict').click(function() {
    console.log('Add individual course conflict button clicked');
    var inputBox1 = $('#conflict-1');
    var inputBox2 = $('#conflict-2');

    var course1 = inputBox1.val();
    var course2 = inputBox2.val();

    if ((course1.length >= 5 && course1.length <= 12) && (course2.length >= 5 && course2.length <= 12)) {
      var course_conflicts = filterVariables.individualCourseConflicts;

      // Sort the values alphabetically
      var individualCourseConflicts = [course1, course2].sort();
      
      // Store the sorted values back into course1 and course2
      course1 = sortedCourses[0];
      course2 = sortedCourses[1];
      if (filterVariables.individualCourseConflicts.some(tuple => tuple[0] === course1[0] && tuple[1] === course2[1])){
        individualCourseConflicts.push([course1, course2]);
        var enteredIndividualCourseConflict = $('');
        $('#entered-individual -course-conflict').append(enteredIndividualCourseConflict);
        inputBox1.val('');
        inputBox2.val('');
      }
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
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
              // handle the response here
              var requirements = JSON.parse(xhr.responseText);
              var requirementsHtml = '';
              for (var i = 0; i < requirements.length; i++) {
                  requirementsHtml += '<li>' + requirements[i] + '</li>';
              }
              document.getElementById("req-list").innerHTML = requirementsHtml;
          }
      };

      xhr.open("GET", url, true);
      xhr.send();
  }

  // add a click event listener to the button
  var searchbtn = document.getElementById("search-btn");
  searchbtn.addEventListener('click', handleButtonClick);


// Get the toggle button and the advanced filtering content element
const toggleButton = document.querySelector("#toggle-advanced-filtering");
const advancedFilteringContent = document.querySelector("#advanced-filtering-content");

// Add an event listener to the toggle button
toggleButton.addEventListener("click", function() {
  // Toggle the display property of the advanced filtering content element
  advancedFilteringContent.style.display = advancedFilteringContent.style.display === "block" ? "none" : "block";
});
// Advanced Filtering 
// Get references to th ccce relevant DOM elements
const toggleBtn = document.getElementById("toggle-advanced-filtering");
const filteringContent = document.getElementById("advanced-filtering-content");
const conflictContainer = document.getElementById("conflict-container");
const rangeContainer = document.getElementById("range-container");
const hiddenSubjectContainer = document.getElementById("hidden-subject-container");
const hiddenClassContainer = document.getElementById("hidden-class-container");
const ignoreSubjectContainer = document.getElementById("ignore-subject-container");
const ignoreClassContainer = document.getElementById("ignore-class-container");
const addConflictBtn = document.getElementById("add-conflict");
const addRangeBtn = document.getElementById("add-range");
const addHiddenSubjectBtn = document.getElementById("add-hidden-subject");
const addHiddenClassBtn = document.getElementById("add-hidden-class");
const addIgnoreSubjectBtn = document.getElementById("add-ignore-subject");
const addIgnoreClassBtn = document.getElementById("add-ignore-class");
const applyFilterBtn = document.getElementById("apply-filter");

// Define helper functions to add and remove conflict, range, and filter inputs
function addInput(container, inputName, inputPlaceholder) {
  const inputWrapper = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.type = "text";
  input.name = inputName;
  input.placeholder = inputPlaceholder;
  inputWrapper.appendChild(label);
  inputWrapper.appendChild(input);
  container.appendChild(inputWrapper);
  return input;
}

function addConflict() {
  addInput(conflictContainer, "conflict-1", "Course 1");
  addInput(conflictContainer, "conflict-2", "Course 2");
}

function addRange() {
  addInput(rangeContainer, "range-subject", "Subject");
  addInput(rangeContainer, "range-start", "Start");
  addInput(rangeContainer, "range-end", "End");
}

function addHiddenSubject() {
  addInput(hiddenSubjectContainer, "hidden-subject", "Subject");
}

function addHiddenClass() {
  addInput(hiddenClassContainer, "hidden-class", "Class");
}

function addIgnoreSubject() {
  addInput(ignoreSubjectContainer, "ignore-subject", "Subject");
}

function addIgnoreClass() {
  addInput(ignoreClassContainer, "ignore-class", "Class");
}

function removeInput(input) {
  const inputWrapper = input.parentNode;
  const container = inputWrapper.parentNode;
  container.removeChild(inputWrapper);
}

// Attach event listeners to the relevant DOM elements
// toggleBtn.addEventListener("click", () => {
//   filteringContent.classList.toggle("active");
// });

addConflictBtn.addEventListener("click", () => {
  addConflict();
});

addRangeBtn.addEventListener("click", () => {
  addRange();
});

addHiddenSubjectBtn.addEventListener("click", () => {
  addHiddenSubject();
});

addHiddenClassBtn.addEventListener("click", () => {
  addHiddenClass();
});

addIgnoreSubjectBtn.addEventListener("click", () => {
  addIgnoreSubject();
});

addIgnoreClassBtn.addEventListener("click", () => {
  addIgnoreClass();
});

applyFilterBtn.addEventListener("click", (event) => {
  event.preventDefault();
  // Do the filtering here
});

// Make the initial call to add some default inputs
addConflict();
addRange();
addHiddenSubject();
addHiddenClass();
addIgnoreSubject();
addIgnoreClass();
});


