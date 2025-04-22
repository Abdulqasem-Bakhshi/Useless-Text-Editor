const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('path'); // import path module for preload

let mainWindow;

function createWindow() {
  if (mainWindow) {
    return;
  }
  mainWindowRes(); // Call the function to create the main window
}
function mainWindowRes() {
  mainWindow = new BrowserWindow({
    minWidth: 400,
    minHeight: 400,
    width: 800,
    height: 800,
    frame: false,
    resizable: true,
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
      nodeIntegration: false,
      contextIsolation: true
    },
  });

  mainWindow.loadFile('index.html');
};

app.on('ready', mainWindowRes);

// Listen for minimize and close events from the renderer process
ipcMain.on('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// Handle the single instance lock
const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  // If another instance is running, quit the app
  app.quit();
} else {
  app.whenReady().then(() => {
    // Create the main window
    createWindow();

    // This will handle the behavior when another instance tries to start
    app.on('second-instance', (event, argv, cwd) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
      }
    });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})})};