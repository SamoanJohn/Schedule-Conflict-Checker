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

    $('#submit-btn').click(function() {
        $.ajax({
          url: '/path/to/your/view/',
          type: 'GET',
          data: {
            majors: selectedItems.majors,
            subjects: selectedItems.subjects
          },
          success: function(response) {
            // Parse the JSON response and update the page
            // with the relevant information
          },
          error: function(xhr, status, error) {
            // Handle errors
          }
        });
      });
  
  });