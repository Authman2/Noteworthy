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
            handleViewContextMenuActions();
            handleSelectionContextMenuActions();
            break;
        case Contexts.Insert:
            body.innerHTML += icm;
            handleViewContextMenuActions();
            handleInsertContextMenuActions();
            break;
        case Contexts.Settings:
            body.innerHTML += stcm;
            handleViewContextMenuActions();
            handleSettingsContextMenuActions();
            break;
    }
}




/************************
*                       *
*       FUNCTIONS       *
*                       *
*************************/


/** Handles actions on the View Context Menu. */
const handleViewContextMenuActions = () => {
    const previousNoteButton = document.getElementById('vcm-previous-note-btn');
    const nextNoteButton = document.getElementById('vcm-next-note-btn');
    const newButton = document.getElementById('vcm-new-btn');
    const shareButton = document.getElementById('vcm-share-btn');
    const notebooksButton = document.getElementById('vcm-notebooks-btn');
    const notesButton = document.getElementById('vcm-notes-btn');

    newButton.onclick = () => {
        
    }
    shareButton.onclick = () => {

    }
    notebooksButton.onclick = () => {

    }
    notesButton.onclick = () => {
        
    }
}

/** Handles actions on the View Context Menu. */
const handleSelectionContextMenuActions = () => {
    const boldBtn = document.getElementById('secm-bold-btn');
    const italicBtn = document.getElementById('secm-italic-btn');
    const underlineBtn = document.getElementById('secm-underline-btn');
    const highlightBtn = document.getElementById('secm-highlight-btn');
    const subscriptBtn = document.getElementById('secm-subscript-btn');
    const superscriptBtn = document.getElementById('secm-superscript-btn');

    boldBtn.onclick = () => {
        
    }
    italicBtn.onclick = () => {

    }
    underlineBtn.onclick = () => {

    }
    highlightBtn.onclick = () => {
        
    }
    subscriptBtn.onclick = () => {
        
    }
    superscriptBtn.onclick = () => {
        
    }
}

/** Handles actions on the View Context Menu. */
const handleInsertContextMenuActions = () => {
    const codeBtn = document.getElementById('icm-code-btn');
    const unsortedBtn = document.getElementById('icm-unsorted-btn');
    const sortedBtn = document.getElementById('icm-sorted-btn');
    const checkboxBtn = document.getElementById('icm-checkbox-btn');
    const imageBtn = document.getElementById('icm-image-btn');

    codeBtn.onclick = () => {

    }
    unsortedBtn.onclick = () => {

    }
    sortedBtn.onclick = () => {

    }
    checkboxBtn.onclick = () => {

    }
    imageBtn.onclick = () => {

    }
}

/** Handles actions on the View Context Menu. */
const handleSettingsContextMenuActions = () => {
    const accountBtn = document.getElementById('stcm-account-btn');
    const saveOnlineBtn = document.getElementById('stcm-save-online-btn');
    const loadOnlineBtn = document.getElementById('stcm-load-online-btn');

    accountBtn.onclick = () => {

    }
    saveOnlineBtn.onclick = () => {

    }
    loadOnlineBtn.onclick = () => {

    }
}



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

BrowserWindow.getFocusedWindow().on('switch-context', (event, command) => {
    switch(currentContext) {
        case Contexts.View:
            currentContext = Contexts.Selection;
            break;
        case Contexts.Selection:
            currentContext = Contexts.Insert;
            break;
        case Contexts.Insert:
            currentContext = Contexts.Settings;
            break;
        case Contexts.Settings:
            currentContext = Contexts.View;
            break;
    }
    updateContextMenu();
})

module.exports = {
    init: init
}