const electron = require('electron');
const path = require('path');
const https = require('https');

const { BrowserWindow, Menu } = electron;
const app = electron.app;

const API_URL = 'https://noteworthy-backend.herokuapp.com';
function fetchAppData(then) {
    https.get(`${API_URL}/app-info`, res => {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });
        res.on('end', () => {
            const d = JSON.parse(data);
            then(d);
        });
    });
}

/************************
*                       *
*        METHODS        *
*                       *
*************************/

/** Handles creating a new application window. */
const createWindow = () => {
    // Create a window object.
    let wind = new BrowserWindow({
        width: 775,
        height: 600,
        minWidth: 300,
        minHeight: 300,
        title: 'Noteworthy',
        titleBarStyle: 'hiddenInset',
        icon: path.join(__dirname, 'res/NoteworthyLogo.png'),
        webPreferences: {
            nodeIntegration: true,
        },
        backgroundColor: 'white',
    });

    // Load the index.html file into the window.
    wind.loadURL('https://noteworthyapp.netlify.com/login');
}


/************************
*                       *
*        STARTING       *
*                       *
*************************/

let defaultOptions = {
    applicationName: 'Noteworthy',
    applicationVersion: '2.0.0',
    copyright: 'Adeola Uthman 2015-2019',
    credits: 'Adeola Uthman',
    iconPath: path.join(__dirname, 'res/NoteworthyLogo.png'),
    version: '2.0.0',
    website: 'https://adeolauthman.com/noteworthy'
};
app.setAboutPanelOptions(defaultOptions);
app.setName('Noteworthy');

app.on('ready', () => {
    fetchAppData(data => {
        app.setAboutPanelOptions({
            ...defaultOptions,
            ...data
        });
    });
    createWindow();
});
app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit() });
app.on('activate', function () { if (BrowserWindow.getFocusedWindow() === null) createWindow() });