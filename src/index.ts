import { app, BrowserWindow, ipcMain } from 'electron';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;


import search from './lib/search' 
import indexFolder from './lib/indexFolder'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
  },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.addListener('upper-request',(event, s:string) => {event.sender.send('upper-response', s.toUpperCase())})
ipcMain.addListener('indexFolder-request',(event, s:string) => {event.sender.send('indexFolder-response', indexFolder(s))})

async function initSearch() {
  const sources = [
    'D:/Ebooks',
    'D:/Downloads',
  ];
  await search.init()
  await search.setSources(sources)
  await search.update()
}

ipcMain.addListener('search-init-request',(event) => initSearch().then(_ => event.sender.send('search-init-response', 'done')))
ipcMain.addListener('search-request',async (event, query) => {event.sender.send('search-response', await search.search(query))})
console.log('test');

(async () => {
  try {
    console.log('running eiif')
    const results = await search.search('arc')
    console.log('results')
    console.log(results)
  } catch (error) {
    
  }
})();