/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const $ = require('jquery');
const fs = require('fs');
const Globals = require('../../Globals.js');


/************************
*                       *
*       VARIABLES       *
*                       *
*************************/

// The root body and the page manager.
var body;
var pager;

// The view that holds the main work area.
var workView;

// The notebooks table view where all of the notebooks and notes are displayed.
var notebooksView;

// The title field.
var titleField;

// The content field.
var contentField;

// The button to open notebooks.
var notesButton;

// Whether or not the notebooks view is open.
var notebookViewIsOpen = false;





/************************
*                       *
*          INIT         *
*                       *
*************************/

/** Start the home page actions. */
const init = (root, pageManager) => {
    body = root;
    pager = pageManager;

    Globals.loadHTMLInto('Work.html', root);
    setupRefs();

    // Button clicks.
    notesButton.onclick = toggleNotebooks;

    // Load the notes.
    const notes = Object.values(loadNotes());
    const a = Globals.mapNotebookToTableCell(notes);
    for(var i in a) { notebooksView.appendChild(a[i]); }
}

/** Gets the references to all of the variables. */
const setupRefs = () => {
    titleField = document.getElementById('titleField');
    contentField = document.getElementById('contentField');
    notesButton = document.getElementById('notesButton');
    workView = document.getElementById('workView');
    notebooksView = document.getElementById('notebooksTableView');
}





/************************
*                       *
*       FUNCTIONS       *
*                       *
*************************/

/** Toggles the notebook view when the button is clicked. */
const toggleNotebooks  = () => {
    notebookViewIsOpen = !notebookViewIsOpen;
    
    switch(notebookViewIsOpen) {
        case true:
            workView.style.right = '300px';
            titleField.style.left = '-300px';
            contentField.style.left = '-300px';
            break;
        case false:
            workView.style.right = '0px';
            titleField.style.left = '0px';
            contentField.style.left = '0px';
            break;
    }
}


/** Saves a note to the local database. Later on the notes can be synced so that
* there is a copy on all devices. */
const saveNote = () => {
    const json =  JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
    console.log(json);
}


/** Loads the notes from the local database. */
const loadNotes = () => {
    const json =  JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
    return json;
}






/************************
*                       *
*         EVENTS        *
*                       *
*************************/

module.exports = {
    init: init
}