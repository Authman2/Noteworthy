/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const $ = require('jquery');
const fs = require('fs');
const marked = require('marked');
const Globals = require('../../Globals.js');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;


/************************
*                       *
*       VARIABLES       *
*                       *
*************************/

// The notes that have been loaded from the database.
var notebooks;
var currentNotebook;
var currentNote;

// The root body and the page manager.
var body;
var pager;

// The view that holds the main work area.
var workView;

// The notebooks table view where all of the notebooks and notes are displayed.
var backButton;
var notebooksView;
var notesView;

// The title field.
var titleField;

// The content field.
var contentField;

// The button to open notebooks.
var notesButton;

// The button to create a new notebook or note.
var createNewButton;

// Whether or not the notebooks view is open.
var notebookViewIsOpen = false;
var notesViewIsOpen = false;





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
    backButton.onclick = () => {
        currentNotebook = null;
        toggleNotes();
    }
    createNewButton.onclick = () => {
        if(notesViewIsOpen === true) {
            Globals.showCreateNewAlert(body, 'Note', (title) => {
                console.log(title);
            });
        }
        else if(notebookViewIsOpen === true) {
            Globals.showCreateNewAlert(body, 'Notebook', (title) => {
                console.log(title);
            });
        } 
    }

    // Load the notebooks and their notes.
    loadNotes();
    populateNotebooks();
}

/** Gets the references to all of the variables. */
const setupRefs = () => {
    titleField = document.getElementById('titleField');
    contentField = document.getElementById('contentField');
    notesButton = document.getElementById('notesButton');
    workView = document.getElementById('workView');
    backButton = document.getElementById('notebooksBackButton');
    notebooksView = document.getElementById('notebooksTableView');
    notesView = document.getElementById('notesTableView');
    createNewButton = document.getElementById('addButton');
}





/************************
*                       *
*       FUNCTIONS       *
*                       *
*************************/

/** Toggles the notebook view when the button is clicked. */
const toggleNotebooks  = () => {
    notebookViewIsOpen = !notebookViewIsOpen;
    
    const titleBar = document.getElementsByClassName('titleBar')[0];
    
    switch(notebookViewIsOpen) {
        case true:
            workView.style.right = '300px';
            titleField.style.left = '-300px';
            contentField.style.left = '-300px';
            titleBar.style.right = '300px';
            break;
        case false:
            workView.style.right = '0px';
            titleField.style.left = '0px';
            contentField.style.left = '0px';
            titleBar.style.right = '0px';
            break;
    }
}

/** Toggles the notes view when a cell is clicked. */
const toggleNotes  = (val) => {
    notesViewIsOpen = !notesViewIsOpen;

    const nbTitleBar = document.getElementById('notebooksTitleLabel');
    if(val) {
        nbTitleBar.innerHTML = `${val.title}`;
        popoulateNotes();
    } else {
        nbTitleBar.innerHTML = 'Notebooks';
    }

    switch(notesViewIsOpen) {
        case true:
            backButton.style.display = 'inline-block';
            nbTitleBar.style.width = '70%';
            notebooksView.style.right = '300px';
            notesView.style.right = '0px';
            break;
        case false:
            backButton.style.display = 'none';
            nbTitleBar.style.width = '80%';
            notebooksView.style.right = '0px';
            notesView.style.right = '-300px';
            break;
    }
}

/** Populates the notebooks view with new data. */
const populateNotebooks = () => {
    const a = Globals.mapNotebookToTableCell(notebooks, (val) => {
        currentNotebook = val;
        toggleNotes(val);
    });

    notebooksView.innerHTML = '';
    for(var i in a) { notebooksView.appendChild(a[i]); }
}

/** Populates the notes view with new data. */
const popoulateNotes = () => {
    if(currentNotebook == null) return;

    const notes = currentNotebook.pages;
    const a = Globals.mapNoteToTableCell(notes, (val) => {
        currentNote = val;
        titleField.value = val.title;

        marked(val.content, (err, resp) => {
            if(err) { contentField.innerHTML = err; return; }
            contentField.innerHTML = resp;
            toggleNotebooks();
        });
    });

    notesView.innerHTML = '';
    for(var i in a) { notesView.appendChild(a[i]); }
}





/************************
*                       *
*        HELPERS        *
*                       *
*************************/

/** Saves a note to the local database. Later on the notes can be synced so that
* there is a copy on all devices. */
const saveNote = () => {
    if(currentNote == null) {}

    const json =  JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
    const note = json[currentNote.id];
    
}


/** Loads the notebooks and notes from the local database. */
const loadNotes = () => {
    const json =  JSON.parse(fs.readFileSync(`${__dirname}/../../Database.json`));
    const nbs = Object.values(json).filter((val, _, __) => val.pages);
    notebooks = nbs;

    // Go through each notebooks and get the notes.
    for(var i in nbs) {
        const notesI = Object.values(json).filter((val, _, __) => {
            return val.notebook === notebooks[i].id
        });
        notebooks[i].pages = notesI;
    }
}





/************************
*                       *
*         EVENTS        *
*                       *
*************************/

/** Save the note. */
BrowserWindow.getFocusedWindow().on('save', (event, command) => {
    saveNote();
});




module.exports = {
    init: init
}