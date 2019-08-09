const { app, BrowserWindow, Menu, MenuItem } = require('deskgap');
const path = require('path');

const fileMenu = new Menu();
fileMenu.append(new MenuItem({
    label: 'Save',
    accelerator: 'Cmd+S',
    click: (menuItem, wind) => {
        console.log("Save!", menuItem);
    }
}))

const menu = new Menu();
menu.append(new MenuItem({
    label: "File",
    submenu: fileMenu
}))

app.once('ready', () => {
    const window = new BrowserWindow({
        center: true,
        closable: true,
        frame: true,
        icon: path.resolve('res', 'NoteworthyLogo.png'),
        title: "Noteworthy",
        titleBarStyle: 'hiddenInset',
        menu: menu,
        show: true
    });
    window.loadURL('https://dev-noteworthyapp.netlify.com/login');
});