/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const fs = require('fs');
const Globals = require('../../Globals.js');


/************************
*                       *
*       VARIABLES       *
*                       *
*************************/





/************************
*                       *
*          INIT         *
*                       *
*************************/

/** Start the home page actions. */
const init = (root) => {
    Globals.loadHTMLInto('Home.html', root);
    console.log('working');
}




/************************
*                       *
*       FUNCTIONS       *
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