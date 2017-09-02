const electron = require('electron')
const fs = require('fs');

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipc = require('electron').ipcMain;

const path = require('path')
const url = require('url')

let mainWindow
let signUpWindow
var windows = [];

// The different pages and components in the app.
const homeFile = fs.readFileSync(__dirname + '/src/pages/home.html', 'utf8');
const signupFile = fs.readFileSync(__dirname + '/src/pages/signup.html', 'utf8');
const loginFile = fs.readFileSync(__dirname + '/src/pages/login.html', 'utf8');
const appSettingsFile = fs.readFileSync(__dirname + '/src/pages/appSettings.html', 'utf8');

const notebooksButtonFile = fs.readFileSync(__dirname + '/src/components/notebooksButton.html', 'utf8');
const notebooksliderFile = fs.readFileSync(__dirname + '/src/components/NotebooksSlider.html', 'utf8');




// Get a reference to the event so that you can send stuff later.
// This method just takes whatever the renderer sends it (which should be the home page) and sends it right back
var eve;
ipc.on('changeCurrentPage-send', (event, args) => {
    eve = event;
    event.sender.send('changeCurrentPage-reply', args, 'home');
});
ipc.on('saveNote-send', (event, title, content) => {
    eve = event;
    event.sender.send('saveNote-reply', title, content);
});



// Create the application menu.
let template = [{
    label: 'File',
    submenu: [{
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('saveNote-reply', global.sharedObject.currentTitle, global.sharedObject.currentContent);
        }
    }]
},{
    label: 'Account',
    submenu: [{
        label: 'Login', 
        click: () => { 
            if(eve !== null && eve !== undefined) {
                eve.sender.send('changeCurrentPage-reply', loginFile, 'login');
            }
        }
    }, {
        label: 'Sign Up',
        click: () => { 
            if(eve !== null && eve !== undefined) {
                eve.sender.send('changeCurrentPage-reply', signupFile, 'signup');
            }
        }
    }, {
        label: 'Account',
        click: () => { 
            // Go to account page.
        }
    }]
},{
    label: 'Window',
    submenu: [{
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => {
            if (focusedWindow) {
                if (focusedWindow.id === 1) {
                    BrowserWindow.getAllWindows().forEach(function (win) {
                        if (win.id > 1) { win.close() }
                    })
                }
                focusedWindow.reload()
            }
        }
    },{
        label: 'Open Developer Tools',
        accelerator: 'CmdOrCtrl+T',
        click: () => { mainWindow.webContents.openDevTools(); }
    }]
}];





/**
    Creates the main application window.
*/
function createMainWindow () {
  	// Create the browser window.
  	mainWindow = new BrowserWindow({
          width: 800, 
          height: 600,
          show: false,
          title: 'Noteworthy'
    })
    mainWindow.setTitle('Noteworthy');

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
    

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
    
    // Create application menu.
    if (process.platform === 'darwin') {
        const name = electron.app.getName();
        template.unshift({
            label: name,
            submenu: [{
                label: `About ${name}`,
                role: 'about'
            },{
                label: 'Settings',
                accelerator: 'CmdOrCtrl+,',
                click: () => { 
                    if(eve !== null && eve !== undefined)
                        eve.sender.send('changeCurrentPage-reply', appSettingsFile, 'appsettings');
                }
            },{
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => { app.quit(); }
            }]
        });
    }
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);   

	
    // Add the window to the array and create the other windows later on.
    windows.push(mainWindow);
    mainWindow.once('ready-to-show', () => { mainWindow.show(); });
	mainWindow.on('closed', function () { for(var i = 0; i < windows.length; i++) { windows[i] = null; } })
}




app.on('ready', createMainWindow)
app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit() })
app.on('activate', function () { if (mainWindow === null) createWindow() })



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// These two methods are for switching between pages in the app. Try not to touch these. You really shouldn't
// have to unless there is a problem when trying to switch to another page.
const reloadContent_Signature = (page, styles) => {
    var body = styles + '<div>' + page + '</div>';
    return body;
}
const defineVariables_Signature = (page, completion) => {
    completion(page);
}


/**
Handles creating all of the html, css, and javascript code necessary for each page.
*/
global.sharedObject = {
    homePage: '' + homeFile + notebooksButtonFile + notebooksliderFile,
    signupPage: '' + signupFile,
    loginPage: '' + loginFile,
    appSettingsPage: '' + appSettingsFile,
    notebooksButton: notebooksButtonFile,
    NotebooksSlider: notebooksliderFile,
        
    currentPage: '<div></div>',
    
    reloadContent: reloadContent_Signature,
    defineVariables: defineVariables_Signature,

    currentUser: null,
    currentTitle: '',
    currentContent: ''
}