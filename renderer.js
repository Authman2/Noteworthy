/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const home = require(__dirname + '/src/js/Home.js');
const work = require(__dirname + '/src/js/Work.js');

/************************
*                       *
*       VARIABLES       *
*                       *
*************************/

// The body element where everything gets displayed.
const root = document.getElementById('root');



/** The main page manager that controls paging in the app. */
class PageManager {

    /************************
    *                       *
    *          INIT         *
    *                       *
    *************************/

    /** Setup this, the page manager, to show the home page. */
    start() {
        this.goTo(home);
        // this.goTo(work);
    }




    /************************
    *                       *
    *       FUNCTIONS       *
    *                       *
    *************************/

    /** Switches to a new page, loads the html and runs the javascript. */
    goTo(page) {
        page.init(root, this);
    }




    /************************
    *                       *
    *         EVENTS        *
    *                       *
    *************************/
}


// Start the page manager (so start the app).
const pageManager = new PageManager();
pageManager.start();