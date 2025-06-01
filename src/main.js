import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
const { updateElectronApp } = require('update-electron-app');

updateElectronApp()

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow = null;
let displayWindow = null;

const createMainWindow = () => {
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    // autoHideMenuBar: true,
    // fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  mainWindow.on('closed', () => {
  // Ferme la fenêtre display si elle est encore ouverte
  if (displayWindow && !displayWindow.isDestroyed()) {
    displayWindow.close();
  }
});

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/main_window/index.html`));
  }
};

function createDisplayWindow() {
  if (displayWindow && !displayWindow.isDestroyed()) {
    displayWindow.show()
    displayWindow.focus()
    return
  }

  displayWindow = new BrowserWindow({
    width: 1280,
    height: 960,
    backgroundColor: '#2e2c29',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  displayWindow.on('closed', () => {
    displayWindow = null
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    displayWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/display.html`);
    displayWindow.webContents.openDevTools();
  } else {
    displayWindow.loadFile(path.join(__dirname, `../renderer/display_window/display.html`));
  }
  // displayWindow.show();
}

app.whenReady().then(() => {
  createMainWindow();
  // createDisplayWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }})

  ipcMain.on("app-reset", () => {
    if (displayWindow && !displayWindow.isDestroyed()) {
      displayWindow.webContents.send("app-reset-notify");
    }
  });

  ipcMain.on('update-team', (_, teamColor, teamName) => {
    if (displayWindow && !displayWindow.isDestroyed()) {
      displayWindow.webContents.send('team-updated', teamColor, teamName);
    }
  })

  ipcMain.on('update-score', (_, teamColor, score) => {
    if (displayWindow && !displayWindow.isDestroyed()) {
      displayWindow.webContents.send('score-updated', teamColor, score);
    }
  })

  ipcMain.on("foul-update", (_, team, count) => {
    if (displayWindow && !displayWindow.isDestroyed()) {
      displayWindow.webContents.send("foul-update", team, count);
    }
  });

  ipcMain.on('update-theme', (_, theme) => {
    if (displayWindow && !displayWindow.isDestroyed()) {
      displayWindow.webContents.send('theme-updated', theme);
    }
  })

  ipcMain.on('update-wayof', (_, wayof) => {
    if (displayWindow && !displayWindow.isDestroyed()) {
      displayWindow.webContents.send('wayof-updated', wayof);
    }
  })

  ipcMain.on('update-type', (_, type) => {
    if (displayWindow && !displayWindow.isDestroyed()) {
      displayWindow.webContents.send('type-updated', type);
    }
  })

  ipcMain.on('update-players', (_, players) => {
    if (displayWindow && !displayWindow.isDestroyed()) {
      displayWindow.webContents.send('players-updated', players);
    }
  })

  ipcMain.on('timer-set', (_, timer, timeInSec) => {
    if (displayWindow && !displayWindow.isDestroyed()) {
      displayWindow.webContents.send('timer-setted', timer, timeInSec);
    }
  })

  ipcMain.on("timer-update", (_, timer, timeInSec) => {
    if (displayWindow && !displayWindow.isDestroyed()) {
      displayWindow.webContents.send("timer-update", timer, timeInSec);
    }
  })

  ipcMain.on('open-display', () => {
    createDisplayWindow();
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});