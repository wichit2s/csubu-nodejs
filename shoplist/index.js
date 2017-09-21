
const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow, popup;

app.on('ready', function () {
  mainWindow = new BrowserWindow({});
  console.log(__dirname);
  const urlpath = url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  });
  mainWindow.loadURL(urlpath);
  mainWindow.on('close', function(){
    app.quit();
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        { 
          label: 'Add Item',
          accelerator: process.platform=='darwin'? 'Command+A': 'Ctrl+A',
          click() {
            showPopup();
          }
        },
        { 
          label: 'Clear'
        },
        { 
          label: 'Quit',
          accelerator: process.platform=='darwin'? 'Command+Q': 'Ctrl+Q',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'DevTool',
      submenu: [
        {
          label: 'Toggle',
          click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
});

function showPopup() {
  popup = new BrowserWindow({
    width: 300,
    height: 200
  });
  const urlpath = url.format({
    pathname: path.join(__dirname, 'popup.html'),
    protocol: 'file:',
    slashes: true
  });
  popup.on('close', function(){ popup = null; });
  popup.loadURL(urlpath);
}


