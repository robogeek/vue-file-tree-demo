import { 
  app, BrowserWindow, ipcMain, dialog 
} from 'electron';
import path from 'path';
import walkdir from 'walkdir';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null
  });

  scanDirectory();
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// const moduleURL = new URL(import.meta.url);
// const __dirname = path.dirname(moduleURL.pathname);
console.log(` dirname ${__dirname}`);

const rootdir = '/Volumes/Extra/akasha-tools/electron-vue-file-browse';

function scanDirectory() {
  walkdir('src', {})
  .on('file', (fn, stat) => {
    console.log(`walkdir sending FILE ${fn}`);
    mainWindow.webContents.send('file', fn.slice(rootdir.length + 1), stat);
  })
  .on('directory', (fn, stat) => {
    console.log(`walkdir sending DIR ${fn}`);
    mainWindow.webContents.send('directory', fn.slice(rootdir.length + 1), stat);
  })
  .on('error', (fn, err) => {
    console.error(`!!!! ${fn} ${err}`);
  });
}

ipcMain.on('rescan-directory', () => {
  scanDirectory();
});

process.on('unhandledRejection', (reason, p) => {
  console.error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
