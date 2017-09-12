const electron = require('electron')
const fs = require('fs');

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipc = require('electron').ipcMain;

const path = require('path')
const url = require('url')

let mainWindow
var windows = [];

// The different pages and components in the app.
const titleBarFile = fs.readFileSync(__dirname + '/src/components/titleBar.html', 'utf8');

const homeFile = fs.readFileSync(__dirname + '/src/pages/home.html', 'utf8');
const signupFile = fs.readFileSync(__dirname + '/src/pages/signup.html', 'utf8');
const loginFile = fs.readFileSync(__dirname + '/src/pages/login.html', 'utf8');
const accountFile = fs.readFileSync(__dirname + '/src/pages/account.html', 'utf8');
const appSettingsFile = fs.readFileSync(__dirname + '/src/pages/appSettings.html', 'utf8');

<<<<<<< HEAD
// const notebooksButtonFile = fs.readFileSync(__dirname + '/src/components/notebooksButton.html', 'utf8');
// const notebooksliderFile = fs.readFileSync(__dirname + '/src/components/NotebooksSlider.html', 'utf8');
// const sidebarButtonFile = fs.readFileSync(__dirname + '/src/components/sidebarButton.html', 'utf8');
// const sidebarFile = fs.readFileSync(__dirname + '/src/components/Sidebar.html', 'utf8');
const sidebarFile = fs.readFileSync(__dirname + '/src/components/sidebar.html', 'utf8');
const optionsSlider = fs.readFileSync(__dirname + '/src/components/optionsSlider.html', 'utf8');
=======
const notebooksButtonFile = fs.readFileSync(__dirname + '/src/components/notebooksButton.html', 'utf8');
const notebooksliderFile = fs.readFileSync(__dirname + '/src/components/NotebooksSlider.html', 'utf8');
const sidebarButtonFile = fs.readFileSync(__dirname + '/src/components/sidebarButton.html', 'utf8');
const sidebarFile = fs.readFileSync(__dirname + '/src/components/Sidebar.html', 'utf8');

>>>>>>> e9bb07169874ef63236bc77d59dae95c3c26c2a6


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
ipc.on('cutText-send', (event) => {
    eve = event;
    event.sender.send('cutText-reply');
});
ipc.on('copyText-send', (event) => {
    eve = event;
    event.sender.send('copyText-reply');
});
ipc.on('pasteText-send', (event) => {
    eve = event;
    event.sender.send('pasteText-reply');
});
ipc.on('selectAllText-send', (event) => {
    eve = event;
    event.sender.send('selectAllText-reply');
});
ipc.on('handlePrint-send', (event) => {
    eve = event;
    event.sender.send('handlePrint-reply');
});
ipc.on('undo-send', (event) => {
    eve = event;
    event.sender.send('undo-reply');
});
ipc.on('redo-send', (event) => {
    eve = event;
    event.sender.send('redo-reply');
});
<<<<<<< HEAD
ipc.on('openSidebar-send', (event) => {
    eve = event;
    event.sender.send('openSidebar-reply');
});
ipc.on('viewNotes-send', (event) => {
    eve = event;
    event.sender.send('viewNotes-reply');
});
=======

>>>>>>> e9bb07169874ef63236bc77d59dae95c3c26c2a6


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
    },{
        label: 'Print',
        accelerator: 'CmdOrCtrl+P',
        click: () => { 
            if(eve !== null && eve !== undefined)
                eve.sender.send('handlePrint-reply');
        }
    }]
},{
    label: 'Edit',
    submenu: [{
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('undo-reply');
        }
    },{
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Shift+Z',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('redo-reply');
        }
    },{
        type: 'separator'
    },{
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('cutText-reply');
        }
    },{
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('copyText-reply');
        }
    },{
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('pasteText-reply');
        }
    },{
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('selectAllText-reply');
        }
    }]
},{
    label: 'Format',
    submenu: [{
        label: 'Bold',
        accelerator: 'CmdOrCtrl+B',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('bold-reply');
        }
    },{
        label: 'Underline',
        accelerator: 'CmdOrCtrl+U',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('underline-reply');
        }
    },{
        label: 'Italic',
        accelerator: 'CmdOrCtrl+I',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('italic-reply');
        }
    },{
        label: 'Font',
        accelerator: 'CmdOrCtrl+F',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('font-reply');
        }
    },{
        label: 'Align Left',
        accelerator: 'CmdOrCtrl+Option+L',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('alignLeft-reply');
        }
    },{
        label: 'Align Center',
        accelerator: 'CmdOrCtrl+Option+C',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('alignCenter-reply');
        }
    },{
        label: 'Align Right',
        accelerator: 'CmdOrCtrl+Option+R',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('alignRight-reply');
        }
    },{
        label: 'Highlight',
        accelerator: 'CmdOrCtrl+H',
        click: () => {
            if(eve !== null && eve !== undefined) eve.sender.send('highlight-reply');
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
        accelerator: 'CmdOrCtrl+Shift+A',
        click: () => { 
            if(eve !== null && eve !== undefined) {
                eve.sender.send('changeCurrentPage-reply', accountFile, 'account');
            }
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
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        click: () => { mainWindow.minimize(); }
<<<<<<< HEAD
    },{
        label: 'Open Sidebar',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('openSidebar-reply');
        }
    },{
        label: 'View Notes',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
            if(eve !== null && eve !== undefined)
                eve.sender.send('viewNotes-reply');
        }
=======
>>>>>>> e9bb07169874ef63236bc77d59dae95c3c26c2a6
    },
    // {
    //     label: 'Open Developer Tools',
    //     accelerator: 'CmdOrCtrl+T',
    //     click: () => { mainWindow.webContents.openDevTools(); }
    // }
    ]
},{
    label: 'Help',
    role: 'help',
    submenu: [{
        label: 'Learn More',
        click: () => { electron.shell.openExternal('http://www.adeolauthman.com') }
<<<<<<< HEAD
    },{
        label: 'Check for Updates',
        click: () => {
            console.log('Checking for updates');
        }
=======
>>>>>>> e9bb07169874ef63236bc77d59dae95c3c26c2a6
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
          title: 'Noteworthy',
          titleBarStyle: 'hiddenInset',
          icon: path.join(__dirname, 'NoteworthyAppIcon.icns')
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
<<<<<<< HEAD
    homePage: '' + titleBarFile + homeFile + sidebarFile + optionsSlider,
=======
    homePage: '' + titleBarFile + homeFile + notebooksButtonFile + notebooksliderFile + sidebarButtonFile + sidebarFile,
>>>>>>> e9bb07169874ef63236bc77d59dae95c3c26c2a6
    signupPage: '' + titleBarFile  + signupFile,
    loginPage: '' + titleBarFile  + loginFile,
    accountPage: '' + titleBarFile + accountFile,
    appSettingsPage: '' + titleBarFile  + appSettingsFile,
<<<<<<< HEAD
=======
    notebooksButton: notebooksButtonFile,
    NotebooksSlider: notebooksliderFile,
    sidebarButton: sidebarButtonFile,
    Sidebar: sidebarFile,
>>>>>>> e9bb07169874ef63236bc77d59dae95c3c26c2a6
    titleBar: titleBarFile,
        
    currentPage: '<div></div>',
    
    reloadContent: reloadContent_Signature,
    defineVariables: defineVariables_Signature,

    currentUser: null,
    currentTitle: '',
    currentContent: ''
}