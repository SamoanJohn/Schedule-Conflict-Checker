/* TODO
courseElement: 
- drag and drop not working
- double click - show all object data, pop up?
- same STime for multiple courseElements:
  - courseElement CSS width = numOfElements / grid-cell width
- height: (end time - start time) * 1px?
- add CSS .conflict
Conflict Box:
- move to bottom?
Format JSON data:
- Del Mthd -> remove whitespace?
- time: 0100pm -> mil time to make calculations on height?
Export button and options to take updated course json data and export in correct format in excel.
*/



// test json location, will need to find json URL from Austin
fetch('/static/json/courses.json')
  .then(response => response.json())
  .then(data => {
    // Loop through course objects and create draggable elements
    data.forEach(course => {
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
  })
  .catch(error => {
    console.error('Error loading courses:', error);
  });

























