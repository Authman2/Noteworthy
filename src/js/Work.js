/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const fs = require('fs');
const $ = require('jquery');
const firebase = require('firebase');
const Globals = require('../../Globals.js');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const { dialog } = require('electron').remote;
const alertify = require('alertify.js');
const storage = require('electron-json-storage');
const Moment = require('moment');
const jsdiff = require('diff');

const worker = new Worker(`${__dirname}/AsyncCode.js`);
worker.addEventListener('message', (event) => {
    // if(currentNote) { saveNote(false, true); }
});


/************************
*                       *
*       VARIABLES       *
*                       *
*************************/

// The storage object.
const store = storage.getDefaultDataPath();

// The notes that have been loaded from the database.
var loadedData = {};
var notebooks;
var currentNotebook;
var currentNote;

// The root body and the page manager.
var body;
var pager;

// The different contexts that are available.
var vcm, secm, icm, stcm;
const Contexts = {
    View: {},
    Selection: {},
    Insert: {},
    Settings: {}
};
var currentContext = Contexts.View;



/************************
*                       *
*          INIT         *
*                       *
*************************/

/** Start the home page actions. */
const init = (root, pageManager) => {
    body = root;
    pager = pageManager;

    Globals.loadHTMLInto('Work.html', body);
    
    setupRefs();
    updateContextMenu();
}

/** Gets the references to all of the variables. */
const setupRefs = () => {
    vcm = fs.readFileSync(`${__dirname}/../html/contexts/ViewContextMenu.html`, 'utf8');
    secm = fs.readFileSync(`${__dirname}/../html/contexts/SelectionContextMenu.html`, 'utf8');
    icm = fs.readFileSync(`${__dirname}/../html/contexts/InsertContextMenu.html`, 'utf8');
    stcm = fs.readFileSync(`${__dirname}/../html/contexts/SettingsContextMenu.html`, 'utf8');
}

/** Updates the view depending on the type of context menu. */
const updateContextMenu = () => {
    $('.context-menu').remove();
    
    switch(currentContext) {
        case Contexts.View:
            body.innerHTML += vcm;
            handleViewContextMenuActions();
            break;
        case Contexts.Selection:
            body.innerHTML += secm;
            break;
        case Contexts.Insert:
            body.innerHTML += icm;
            break;
        case Contexts.Settings:
            body.innerHTML += stcm;
            break;
    }
}

/** Handles actions on the View Context Menu. */
const handleViewContextMenuActions = () => {
    const previousNoteButton = document.getElementById('vcm-previous-note-btn');
    const nextNoteButton = document.getElementById('vcm-next-note-btn');
    const newButton = document.getElementById('vcm-new-btn');
    const saveButton = document.getElementById('vcm-save-btn');
    const shareButton = document.getElementById('vcm-share-btn');
    const notebooksButton = document.getElementById('vcm-notebooks-btn');
    const notesButton = document.getElementById('vcm-notes-btn');

    newButton.onclick = () => {
        
    }
    saveButton.onclick = () => {

    }
    shareButton.onclick = () => {

    }
    notebooksButton.onclick = () => {

    }
    notesButton.onclick = () => {
        
    }
}



/************************
*                       *
*       FUNCTIONS       *
*                       *
*************************/



/************************
*                       *
*        HELPERS        *
*                       *
*************************/






/************************
*                       *
*         EVENTS        *
*                       *
*************************/

module.exports = {
    init: init
}