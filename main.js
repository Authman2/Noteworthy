const electron = require('electron');
const fs = require('fs');
const url = require('url');
const path = require('path');

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu


// The event handler.
var eve;

// Create the application menu.
let template = [{
    label: 'File',
    submenu: [{
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('new');
        }
    },{
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('save');
        }
    },{
        label: 'Print',
        accelerator: 'CmdOrCtrl+P',
        click: () => { 
            BrowserWindow.getFocusedWindow().emit('print');
        }
    },{
        label: 'Share',
        accelerator: 'CmdOrCtrl+Option+S',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('share');
        }
    }, {
        label: 'New Window',
        accelerator: 'CmdOrCtrl+Option+N',
        click: () => { createWindow(); }
    }]
},{
    label: 'Edit',
    submenu: [{
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('undo');
        }
    },{
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Shift+Z',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('redo');
        }
    },{
        type: 'separator'
    },{
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('cut');
        }
    },{
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('copy');
        }
    },{
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('paste');
        }
    },{
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('select-all');
        }
    }]
},{
    label: 'Selection',
    submenu: [{
        label: 'Bold',
        accelerator: 'CmdOrCtrl+B',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('bold');
        }
    },{
        label: 'Italic',
        accelerator: 'CmdOrCtrl+I',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('italic');
        }
    },{
        label: 'Underline',
        accelerator: 'CmdOrCtrl+U',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('underline');
        }
    },{
        label: 'Highlight',
        accelerator: 'CmdOrCtrl+H',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('highlight');
        }
    },{
        label: 'Subscript',
        accelerator: 'CmdOrCtrl+Option+6',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('subscript');
        }
    },{
        label: 'Superscript',
        accelerator: 'CmdOrCtrl+Shift+6',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('superscript');
        }
    }]
},{
    label: 'Insert',
    submenu: [{
        label: 'Code',
        accelerator: 'CmdOrCtrl+Shift+C',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('code-segment');
        }
    },{
        label: 'Bulleted List',
        accelerator: 'CmdOrCtrl+Shift+B',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('bulleted-list');
        }
    },{
        label: 'Numbered List',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('numbered-list');
        }
    },{
        label: 'Checkbox',
        accelerator: 'CmdOrCtrl+Shift+B',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('checkbox');
        }
    }]
},{
    label: 'Settings',
    submenu: [{
        label: 'Account',
        accelerator: 'CmdOrCtrl+Shift+A',
        click: () => { 
            BrowserWindow.getFocusedWindow().emit('show-account');
        }
    },{
        label: 'Save Online',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('save-online');
        }
    },{
        label: 'Load Online',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('load-online');
        }
    }, {
        label: 'Backup Notes',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('backup');
        }
    }, {
        label: 'Retrieve from Backups',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('retrieve-backups');
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
        label: 'Switch Context',
        accelerator: 'CmdOrCtrl+L',
        click: () => {
            BrowserWindow.getFocusedWindow().emit('switch-context');
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
        click: () => { electron.shell.openExternal('http://www.adeolauthman.com/projects/Noteworthy') }
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
        width: 775,
        height: 600,
        minWidth: 300,
        minHeight: 300,
        title: 'Noteworthy',
        titleBarStyle: 'hiddenInset',
        icon: 'NoteworthyAppLogo.icns',
        webPreferences: {
            nodeIntegration: true,
        }
    });

    // Load the index.html file into the window.
    wind.loadURL('https://noteworthyapp.netlify.com/login');
    // wind.loadURL('http://localhost:3000');
    // setTimeout(() => {
    //     let event = new Event('customHello');
    //     self.dispatchEvent(event);
    //     console.log('dispatched');
    // }, 2000);
    // wind.loadURL(url.format({
    //     pathname: path.join(__dirname, 'dist', 'index.html'),
    //     protocol: 'file:',
    //     slashes: true,
    // }));
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
                label: 'Close Window',
                accelerator: 'CmdOrCtrl+W',
                click: () => { 
                    BrowserWindow.getFocusedWindow().close();
                }
            },{
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => { 
                    app.quit();
                }
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
    // if(!isDev) {
    //     autoUpdater.checkForUpdates();
    // }

    createWindow();
    createAppMenu();
});
app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit() });
app.on('activate', function () { if (BrowserWindow.getFocusedWindow() === null) createWindow() });