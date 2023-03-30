// time grid object
class timeData {
  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.days = null;
    this.css = null; // import the timeCell css
  }
  // duplicate function used in courseblock ****
  loadCSS() {
    this.css = document.querySelector('.timeCell');
  }
}


// course object and json information retrieval 
class course {
  constructor() {
    this.title = null;
    this.start = null; 
    this.end = null;
    this.duration = null; // may not be needed, end - start.
    this.subject = null;
    this.major = null;
    this.section = null;
    this.days = null;
    this.css = null; // not sure if this is used like this yet.
  }

  loadFromJSON(url) {
    return fetch(url)
      .then(data => {
        this.title = data.title;
        this.start = data.start; 
        this.end = data.end;
        this.duration = (this.end - this.start); // check on this 
        this.subject = data.subject;
        this.major = data.major;
        this.section = data.section;
        this.days = data.days;
        return this;
      })
      .catch(error => {
        console.error('Error loading JSON', error);
      });
  }

  loadCSS() {
    this.css = document.querySelector('.course-block');
  }

}

/* Loop to create all course blocks, then will need to 
  initiate into the corresponding timeCell. 
/*
const courseBlock =  new course();
courseBlock.loadFromJSON(JSONresponse??);
courseBlock.loadCSS();
*/

/* Course Block element for testing, todo import json info, add css to courseblock object */
const courseBlock = document.querySelector('.course-block');

courseBlock.addEventListener('dragstart', dragStart);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);
}


/* target the time cell and highlight with border */
const tcells = document.querySelectorAll('.timeCell');
const gcells = document.querySelectorAll('.gridCell');

tcells.forEach((cell) => {
    cell.addEventListener('dragenter', dragEnter)
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('dragleave', dragLeave);
    cell.addEventListener('drop', drop);
});

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    e.target.classList.remove('drag-over');

    // get the draggable element
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);

    // add it to the drop target
    e.target.appendChild(draggable);

    // display the draggable element
    draggable.classList.remove('hide');
}

