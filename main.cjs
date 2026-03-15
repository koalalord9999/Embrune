const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the index.html from your existing dist folder
  win.loadFile(path.join(__dirname, 'dist/index.html'));
}

app.whenReady().then(() => {
  createWindow();

  // --- ADDED DEBUGGING LISTENERS ---
  autoUpdater.on('checking-for-update', () => { 
    console.log('Checking for update...'); 
  });
  autoUpdater.on('update-available', (info) => { 
    console.log('Update available.', info); 
  });
  autoUpdater.on('update-not-available', (info) => { 
    console.log('Update not available.', info); 
  });
  autoUpdater.on('error', (err) => { 
    console.error('Error in auto-updater: ' + err); 
  });
  autoUpdater.on('download-progress', (progressObj) => { 
    console.log('Download speed: ' + progressObj.bytesPerSecond); 
  });
  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded');
    const { dialog } = require('electron');
    dialog.showMessageBox({
      type: 'info',
      title: 'Embrune Updater',
      message: 'A new version of Embrune is available. Would you like to install it now?',
      buttons: ['Install Now', 'Later']
    }).then((returnValue) => {
      if (returnValue.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
  // ---------------------------------
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
