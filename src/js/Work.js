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

}

/** Gets the references to all of the variables. */
const setupRefs = () => {
    
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