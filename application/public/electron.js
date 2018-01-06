const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ 
    width: 900, 
    height: 960, 
    transparent: true, // Set frame transparent
    //frame: false  // Is a frame visible?
  });

  mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);

  // Open the DevTools
  //mainWindow.webContents.openDevTools();

  // When we close the mainWindow,
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  mainWindow.on("closed", () => (mainWindow = null));
}

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
