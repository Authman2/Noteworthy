/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const electron = require('electron')
const fs = require('fs');
const url = require('url');
const path = require('path');
const ipc = require('electron').ipcMain;

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu



/************************
*                       *
*       VARIABLES       *
*                       *
*************************/

// An array of all the application windows that are currently open.
// Also the index of the currently open window.
var windows = [];
var currentWindow = 0;

// The event handler.
var eve;

/**
Handles creating all of the html, css, and javascript code necessary for each page.
*/
global.sharedObject = {
    currentUser: null,
    currentTitle: '',
    currentContent: '',
    currentID: ''
}


// Create the application menu.
let template = [{
    label: 'File',
    submenu: [{
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('save');
        }
    },{
        label: 'Print',
        accelerator: 'CmdOrCtrl+P',
        click: () => { 
            if(eve !== null && eve !== undefined)
                eve.sender.send('print');
        }
    },{
        label: 'Share',
        submenu: [{
            label: 'Email',
            click: () => {
                if(eve !== null && eve !== undefined)
                    eve.sender.send('share-email');
            }
        }]
    },{
        label: 'New Window',
        accelerator: 'CmdOrCtrl+Shift+N',
        click: () => { createWindow(); }
    }]
},{
    label: 'Edit',
    submenu: [{
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('undo');
        }
    },{
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Shift+Z',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('redo');
        }
    },{
        type: 'separator'
    },{
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('cut');
        }
    },{
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('copy');
        }
    },{
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('paste');
        }
    },{
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('select-all');
        }
    }]
},{
    label: 'Insert',
    submenu: [{
        label: 'Subscript',
        accelerator: 'CmdOrCtrl+Option+6',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('subscript');
        }
    },{
        label: 'Superscript',
        accelerator: 'CmdOrCtrl+Shift+6',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('superscript');
        }
    },{
        label: 'Bulleted List',
        accelerator: 'CmdOrCtrl+Shift+B',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('bulleted-list');
        }
    },{
        label: 'Numbered List',
        accelerator: 'CmdOrCtrl+Shift+N',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('numbered-list');
        }
    },{
        label: 'Code Segment',
        accelerator: 'CmdOrCtrl+Shift+C',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('code-segment');
        }
    }]
},{
    label: 'Format',
    submenu: [{
        label: 'Bold',
        accelerator: 'CmdOrCtrl+B',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('bold');
        }
    },{
        label: 'Underline',
        accelerator: 'CmdOrCtrl+U',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('underline');
        }
    },{
        label: 'Italic',
        accelerator: 'CmdOrCtrl+I',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('italic');
        }
    },{
        label: 'Font',
        accelerator: 'CmdOrCtrl+F',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('font');
        }
    },{
        label: 'Align Left',
        accelerator: 'CmdOrCtrl+Option+L',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('align-left');
        }
    },{
        label: 'Align Center',
        accelerator: 'CmdOrCtrl+Option+C',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('align-center');
        }
    },{
        label: 'Align Right',
        accelerator: 'CmdOrCtrl+Option+R',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('align-right');
        }
    },{
        label: 'Highlight',
        accelerator: 'CmdOrCtrl+H',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('highlight');
        }
    }]
},{
    label: 'Login',
    submenu: [{
        label: 'Login',
        click: () => { 
            if(eve !== null && eve !== undefined) {
                eve.sender.send('goto-login');
            }
        }
    }, {
        label: 'Sign Up',
        click: () => { 
            if(eve !== null && eve !== undefined) {
                eve.sender.send('goto-signup');
            }
        }
    }, {
        label: 'Account',
        accelerator: 'CmdOrCtrl+Shift+A',
        click: () => { 
            if(eve !== null && eve !== undefined) {
                eve.sender.send('goto-account');
            }
        }
    }, {
        label: 'Backup Notes',
        click: () => {
            if(eve !== null && eve !== undefined)
            eve.sender.send('backup');
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
                    });
                }
                focusedWindow.reload()
            }
        }
    },{
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        click: () => { windows[currentWindow].minimize(); }
    },{
        label: 'View Notes',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('open-sidebar');
        }
    },{
        label: 'Note Options',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('note-options');
        }
    },
    {
        label: 'Open Developer Tools',
        accelerator: 'CmdOrCtrl+T',
        click: () => { windows[currentWindow].webContents.openDevTools(); }
    }
    ]
},{
    label: 'Help',
    role: 'help',
    submenu: [{
        label: 'Learn More',
        click: () => { electron.shell.openExternal('http://www.adeolauthman.com') }
    },{
        label: 'Check for Updates',
        click: () => {
            if(eve !== null && eve !== undefined)
            eve.sender.send('check-updates');
        }
    }]
}];





/************************
*                       *
*        METHODS        *
*                       *
*************************/

/** Handles creating a new application window. */
const createWindow = () => {
    // Create a window object.
    let wind = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        title: 'Noteworthy',
        titleBarStyle: 'hiddenInset',
        icon: path.join(__dirname, 'NoteworthyAppIcon.icns')
    });

    // Load the index.html file into the window.
    wind.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Add that window that we just created to the array of them.
    // Then, quickly calculate the placement in the array of this window.
    windows.push(wind);
    const placement = windows.length - 1;
    
    wind.once('ready-to-show', () => { wind.show(); });
    wind.on('focus', () => {
        currentWindow = placement;
    });
	wind.on('closed', function () { for(var i = 0; i < windows.length; i++) { windows[i] = null; } })
}


/** Creates the application menu at the top of the computer screen. */
const createAppMenu = () => {
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
                        eve.sender.send('goto-app-settings');
                }
            },{
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => { eve.sender.send('quit-app'); }
            }]
        });
    }
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);  
}






/************************
*                       *
*        STARTING       *
*                       *
*************************/

app.on('ready', () => {
    createWindow();
    createAppMenu();
});
app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit() });
app.on('activate', function () { if (windows[0] === null) createWindow() });


ipc.on('init', (event) => {
    eve = event;
})