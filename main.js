/************************
*                       *
*        REQUIRES       *
*                       *
*************************/

const electron = require('electron');
const fs = require('fs');
const url = require('url');
const path = require('path');
const ipc = require('electron').ipcMain;
// const autoUpdater = require('electron-updater').autoUpdater;
// const isDev = require('electron-is-dev');

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

// Setup logger.
// autoUpdater.logger = require('electron-log');
// autoUpdater.logger.transports.file.level = 'info';

// Setup events.
// autoUpdater.on('checking-for-update', () => {
//     console.log('Checkign for update...');
// });
// autoUpdater.on('update-available', (info) => {
//     console.log('Found update!');
//     console.log(`Version: ${info.version}, Release Date: ${info.releaseDate}`);
//     autoUpdater.quitAndInstall();
// });
// autoUpdater.on('update-not-available', () => {
//     console.log('No update available');
// });
// autoUpdater.on('download-progress', (progress) => {
//     console.log('Download progress: ', progress.percent);
// });
// autoUpdater.on('update-downloaded', () => {
//     console.log('Downlaoded update!!');
//     autoUpdater.quitAndInstall();
// });
// autoUpdater.on('error', (err) => {
//     console.log('Error: ', err);
// });




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
    
}


// Create the application menu.
let template = [{
    label: 'File',
    submenu: [{
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('new');
        }
    },{
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
        accelerator: 'CmdOrCtrl+Option+S',
        click: () => {
            if(eve !== null && eve !== undefined)
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
    }]
},{
    label: 'Selection',
    submenu: [{
        label: 'Bold',
        accelerator: 'CmdOrCtrl+B',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('bold');
        }
    },{
        label: 'Italic',
        accelerator: 'CmdOrCtrl+I',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('italic');
        }
    },{
        label: 'Underline',
        accelerator: 'CmdOrCtrl+U',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('underline');
        }
    },{
        label: 'Highlight',
        accelerator: 'CmdOrCtrl+H',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('highlight');
        }
    },{
        label: 'Subscript',
        accelerator: 'CmdOrCtrl+Option+6',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('subscript');
        }
    },{
        label: 'Superscript',
        accelerator: 'CmdOrCtrl+Shift+6',
        click: () => {
            if(eve !== null && eve !== undefined) BrowserWindow.getFocusedWindow().emit('superscript');
        }
    }]
},{
    label: 'Insert',
    submenu: [{
        label: 'Code',
        accelerator: 'CmdOrCtrl+Shift+C',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('code-segment');
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
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('numbered-list');
        }
    },{
        label: 'Checkbox',
        accelerator: 'CmdOrCtrl+Shift+B',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('checkbox');
        }
    },{
        label: 'Image',
        accelerator: 'CmdOrCtrl+Shift+M',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('image');
        }
    }]
},{
    label: 'Settings',
    submenu: [{
        label: 'Account',
        accelerator: 'CmdOrCtrl+Shift+A',
        click: () => { 
            if(eve !== null && eve !== undefined) {
                BrowserWindow.getFocusedWindow().emit('goto-account');
            }
        }
    },{
        label: 'Save Online',
        click: () => {
            if(eve !== null && eve !== undefined) 
                BrowserWindow.getFocusedWindow().emit('save-online');
        }
    },{
        label: 'Load Online',
        click: () => {
            if(eve !== null && eve !== undefined) 
                BrowserWindow.getFocusedWindow().emit('load-online');
        }
    }, {
        label: 'Backup Notes',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('backup');
        }
    }, {
        label: 'Retrieve from Backups',
        click: () => {
            if(eve !== null && eve !== undefined)
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
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('switch-context');
        }
    },{
        label: 'Quick Move Left',
        accelerator: 'CmdOrCtrl+Shift+{',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('quick-move-left');
        }
    },{
        label: 'Quick Move Right',
        accelerator: 'CmdOrCtrl+Shift+}',
        click: () => {
            if(eve !== null && eve !== undefined)
                BrowserWindow.getFocusedWindow().emit('quick-move-right');
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
        title: 'Noteworthy',
        titleBarStyle: 'hiddenInset',
        icon: path.join(__dirname, 'NoteworthyAppLogo.icns')
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
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => { 
                    BrowserWindow.getFocusedWindow().emit('quit-app');
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


ipc.on('init', (event) => {
    eve = event;
})