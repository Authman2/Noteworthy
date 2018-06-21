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
    Globals.loadHTMLInto('Work.html', root);
    console.log('working page');
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