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
});
