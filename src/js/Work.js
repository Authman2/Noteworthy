/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const $ = require('jquery');
const fs = require('fs');
const marked = require('marked');
const Globals = require('../../Globals.js');


/************************
*                       *
*       VARIABLES       *
*                       *
*************************/

// The root body and the page manager.
var body;
var pager;

// The title field.
var titleField;

// The content field.
var contentField;

// Temporary test note.
var note = '';
var caret = 0;





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

    // Setup the markdown text editing action of the content view.
    contentField.onkeypress = didEditText;
}

/** Gets the references to all of the variables. */
const setupRefs = () => {
    titleField = document.getElementById('titleField');
    contentField = document.getElementById('contentField');
}





/************************
*                       *
*       FUNCTIONS       *
*                       *
*************************/

/** Called when the user types into the content field. */
const didEditText = (e) => {
    // if(e.target.id !== 'root') { return; }

    const val = e.key;
    note += val;

    if(note.length == 40) {
        note = note.substring(0, 20) + '***' + note.substring(20,30) + '***' + note.substring(30);
    }

    contentField.innerHTML = '';
    marked(note, (_, resp) => {
        contentField.innerHTML = resp;
    });
}

if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.insert = function(start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}





/************************
*                       *
*         EVENTS        *
*                       *
*************************/

module.exports = {
    init: init
}