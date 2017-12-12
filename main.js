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

// The event handler.
var eve;

/**
Handles creating all of the html, css, and javascript code necessary for each page.
*/
global.sharedObject = {
    currentUser: null,
    currentTitle: '',
    currentContent: '',
    currentID: '',
    currentScroll: 0
}


// Create the application menu.
let template = [{
    label: 'File',
    submenu: [{
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('save');
        }
    },{
        label: 'Print',
        accelerator: 'CmdOrCtrl+P',
        click: () => { 
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('print');
        }
    },{
        label: 'Share',
        submenu: [{
            label: 'Email',
            click: () => {
                if(eve !== null && eve !== undefined)
                    BrowserWindow.getFocusedWindow().emit('share-email');
            }
        }]
    },{
        label: 'Export',
        submenu: [{
            label: 'PDF',
            click: () => { if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('export-pdf'); }
        },{
            label: 'Plain Text',
            click: () => { if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('export-txt'); }
        },{
            label: 'Markdown',
            click: () => { if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('export-md'); }
        },{
            label: 'HTML',
            click: () => { if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('export-html'); }
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
                BrowserWindow.getFocusedWindow().emit('undo');
        }
    },{
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Shift+Z',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('redo');
        }
    },{
        type: 'separator'
    },{
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('cut');
        }
    },{
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('copy');
        }
    },{
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('paste');
        }
    },{
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('select-all');
        }
    },{
        label: 'Find/Replace',
        accelerator: 'CmdOrCtrl+A',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('find-replace');
        }
    }]
},{
    label: 'Insert',
    submenu: [{
        label: 'Subscript',
        accelerator: 'CmdOrCtrl+Option+6',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('subscript');
        }
    },{
        label: 'Superscript',
        accelerator: 'CmdOrCtrl+Shift+6',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('superscript');
        }
    },{
        label: 'Bulleted List',
        accelerator: 'CmdOrCtrl+Shift+B',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('bulleted-list');
        }
    },{
        label: 'Numbered List',
        accelerator: 'CmdOrCtrl+Shift+N',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('numbered-list');
        }
    },{
        label: 'Code Segment',
        accelerator: 'CmdOrCtrl+Shift+C',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('code-segment');
        }
    }]
},{
    label: 'Format',
    submenu: [{
        label: 'Bold',
        accelerator: 'CmdOrCtrl+B',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('bold');
        }
    },{
        label: 'Underline',
        accelerator: 'CmdOrCtrl+U',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('underline');
        }
    },{
        label: 'Italic',
        accelerator: 'CmdOrCtrl+I',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('italic');
        }
    },{
        label: 'Font',
        accelerator: 'CmdOrCtrl+F',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('font');
        }
    },{
        label: 'Align Left',
        accelerator: 'CmdOrCtrl+Option+L',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('align-left');
        }
    },{
        label: 'Align Center',
        accelerator: 'CmdOrCtrl+Option+C',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('align-center');
        }
    },{
        label: 'Align Right',
        accelerator: 'CmdOrCtrl+Option+R',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('align-right');
        }
    },{
        label: 'Highlight',
        accelerator: 'CmdOrCtrl+H',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('highlight');
        }
    }]
},{
    label: 'Login',
    submenu: [{
        label: 'Login',
        accelerator: 'CmdOrCtrl+Shift+L',
        click: () => {
            if(eve !== null && eve !== undefined) {
                BrowserWindow.getFocusedWindow().emit('goto-login');
            }
        }
    }, {
        label: 'Sign Up',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => { 
            if(eve !== null && eve !== undefined) {
                BrowserWindow.getFocusedWindow().emit('goto-signup');
            }
        }
    }, {
        label: 'Account',
        accelerator: 'CmdOrCtrl+Shift+A',
        click: () => { 
            if(eve !== null && eve !== undefined) {
                BrowserWindow.getFocusedWindow().emit('goto-account');
            }
        }
    }, {
        label: 'Backup Notes',
        click: () => {
            if(eve !== null && eve !== undefined)
            BrowserWindow.getFocusedWindow().emit('backup');
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
        click: () => { BrowserWindow.getFocusedWindow().minimize(); }
    },{
        label: 'View Notes',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('open-sidebar');
        }
    },{
        label: 'Note Options',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('note-options');
        }
    },
    {
        label: 'Open Developer Tools',
        accelerator: 'CmdOrCtrl+T',
        click: () => { BrowserWindow.getFocusedWindow().webContents.openDevTools(); }
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
            BrowserWindow.getFocusedWindow().emit('check-updates');
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
                        BrowserWindow.getFocusedWindow().emit('goto-app-settings');
                }
            },{
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => { BrowserWindow.getFocusedWindow().emit('quit-app'); }
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