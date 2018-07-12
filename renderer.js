/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const firebase = require('firebase');
const alertify = require('alertify.js');
const home = require(__dirname + '/src/js/Home.js');
const work = require(__dirname + '/src/js/Work.js');
const ipc = require('electron').ipcRenderer;
const app = require('electron').remote.app;
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;

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
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.goTo(work);
            } else {
                this.goTo(home);
            }
        }, (_) => {
            this.goTo(home);
        });
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

}


// Start the page manager (so start the app).
ipc.send('init');
const pageManager = new PageManager();
pageManager.start();


/************************
*                       *
*         EVENTS        *
*                       *
*************************/

BrowserWindow.getFocusedWindow().on('quit-app', (event, command) => {
    work.save(false);
    app.quit();
});
// BrowserWindow.getFocusedWindow().on('check-updates', (event, command) => {
    
// });