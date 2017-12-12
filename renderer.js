/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const fs = require('fs');
const ipc = require('electron').ipcRenderer;
const alertify = require('alertify.js');
const $ = require('jquery');
const path = require('path');
const url = require('url');
const shell = require('shelljs');
const app = require('electron').remote.app;
const helpers = require('./src/js/helpers.js');
const BrowserWindow = require('electron').remote.BrowserWindow;

const firebase = require('firebase');
const config = require(__dirname + '/creds.json');
firebase.initializeApp(config);


// Get references to all the different app pages.
const homeJS = require('./src/js/home.js');
const accountJS = require('./src/js/account.js');
const loginJS = require('./src/js/login.js');
const signupJS = require('./src/js/signup.js');
const settingsJS = require('./src/js/app-settings.js');



/************************
*                       *
*       VARIABLES       *
*                       *
*************************/

// The body element where everything gets displayed.
const root = document.getElementById('root');

// Firebase stuff.
const fireRef = firebase.database().ref();
const fireAuth = firebase.auth();

// The settings for the app.
var appSettings = JSON.parse(fs.readFileSync(__dirname + '/appSettings.json'));




/************************
*                       *
*          INIT         *
*                       *
*************************/

// 0.) Add the title bar to the app and do other initial setup that will be
// present regardless of the page.
const titleBar = fs.readFileSync(__dirname + '/src/html/title-bar.html', 'utf8');


// Dispatch an 'init' call so that event stuff can be handled from the start,
// instead of on a 'when called' basis.
ipc.send('init');




/************************
*                       *
*         LOGIC         *
*                       *
*************************/

// 1.) Start by displaying the home page by default.
homeJS(root, titleBar, appSettings, fireAuth, fireRef, ipc, true);



/************************
*                       *
*         EVENTS        *
*                       *
*************************/

BrowserWindow.getFocusedWindow().on('goto-login', (event) => {
    loginJS(root, titleBar, fireAuth, fireRef, () => {
        homeJS(root, titleBar, appSettings, fireAuth, fireRef, ipc, false);
    });
});
BrowserWindow.getFocusedWindow().on('goto-signup', (event) => {
    signupJS(root, titleBar, fireAuth, fireRef, () => {
        homeJS(root, titleBar, appSettings, fireAuth, fireRef, ipc, false);
    });
});
BrowserWindow.getFocusedWindow().on('goto-account', (event) => {
    accountJS(root, titleBar, fireAuth, fireRef, () => {
        homeJS(root, titleBar, appSettings, fireAuth, fireRef, ipc, false);
    });
});
BrowserWindow.getFocusedWindow().on('goto-app-settings', (event) => {
    settingsJS(root, titleBar, appSettings, () => {
        // Also reload the settings.
        appSettings = JSON.parse(fs.readFileSync(__dirname + '/appSettings.json'));

        homeJS(root, titleBar, appSettings, fireAuth, fireRef, ipc, false);
    });
});

BrowserWindow.getFocusedWindow().on('backup', (event) => {
    helpers.showPromptDialog('Backing up your notes will save a local copy to your computer. Be sure to do this often to avoid losing your notes. Below, enter the location where you would like the backup to be stored.', 'Choose Backup Location', 'Cancel', () => {
        const { dialog } = require('electron').remote;
        dialog.showOpenDialog(null, {
            properties: ['openDirectory']
        }, (paths) => {
            if(paths !== undefined) {
                
                // Create a folder for the notes.
                const path = paths[0] + '/NoteworthyNotes_' + global.currentUser.firstName + global.currentUser.lastName;
                fs.mkdir(path);

                // Write files for each note to this folder.
                for(var i = 1; i < notebooks.length; i++) {
                    const current = notebooks[i];
                    const fileName = path + '/' + current.title + '_' + Date.now() + '.txt';
                    shell.touch(fileName);
                    fs.writeFileSync(fileName, JSON.stringify(current), 'utf8');
                }
                alert('Your notes have been backed up successfully!');
            }
        });
    });
});
BrowserWindow.getFocusedWindow().on('check-updates', (event) => {
    fireRef.child('Version').once('value', (snap) => {
        const latestVersion = snap.val();

        if(app.getVersion() !== latestVersion) {
            // Get the newest updates
            fireRef.child('NewInThisVersion').once('value', (snap2) => {
                const btnStyle = 'width:100px; height:35px; border:none; outline:none; cursor:pointer; background:none; border-radius:25px; background-color:lightgreen;';
                const btnClick = "const shell = require('shelljs'); shell.config.execPath='/usr/local/bin/node'; shell.exec('open http://www.adeolauthman.com');";
    
                var alrt = '<div style="text-align:center">';
                alrt += '<p style="font-size:18px;">There is a new version of Noteworthy!</p>';
                alrt += '<h3>Version ' + latestVersion + '!</h3>';
                alrt += '<p>1.) Head over to www.adeolauthman.com<br>2.) Go to Noteworthy under the "Projects" tab to download the latest version.';
                alrt += '<br><br>';
                alrt += '<p> <b>New in Version ' + latestVersion + ':</b> ' + snap2.val() + '</p>';
                alrt += '<button onclick="' + btnClick + '" style="' + btnStyle + '">Go to Website</button>';
                alrt += '</div>';
                alertify.alert(alrt);
    
            });
            
        } else {
            alert("You already have the latest version of Noteworthy!");
        }
    })
});