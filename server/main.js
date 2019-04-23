const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let win;

function portWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', portWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'win32')
        app.quit();
})