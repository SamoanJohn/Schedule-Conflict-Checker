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
    console.log('Subject: ' + inputSubject + '   start: ' + inputRangeStart + '   end: ' + inputRangeEnd);

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
            console.log('Subject dropdown changed');

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
  