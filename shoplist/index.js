const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

//process.env.NODE_ENV = 'production';

let mainWindow;
let popup;

app.on('ready', function() {
  mainWindow = new BrowserWindow({});
  let html = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slasses: true
  });
  //console.log(__dirname);
  //console.log(html);
  mainWindow.loadURL(html);

  mainWindow.on('closed', function() {
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createPopup() {
  popup = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Shopping List Item',
  });
  let html = url.format({
    pathname: path.join(__dirname, 'popup.html'),
    protocol: 'file:',
    slasses: true
  });
  popup.loadURL(html);
  popup.on('closed', function() {
    popup = null;
  });
}

ipcMain.on('item:add', function(e, item) {
  mainWindow.webContents.send('item:add', item);
  popup.close();
});

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click() {
          createPopup();
        }
      },
      {
        label: 'Clear Item',
        click() {
          mainWindow.webContents.send('item:clear');
        }

      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin'? 'Command+Q':'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin'? 'Command+I':'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
