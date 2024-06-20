const { app, BrowserWindow, shell, ipcMain } = require("electron");
const path = require("path");
const settings = require("electron-settings");
const Positioner = require("electron-positioner");
const AutoLaunch = require("auto-launch");

// Setup auto-launch
const autoLauncher = new AutoLaunch({
  name: "ElectronJSWidget",
  path: app.getPath("exe"),
});

let mainWindow; // Declare mainWindow variable globally

// Function to create the main window
function createWindow() {
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 250,
    height: 250,
    resizable: false,
    movable: true,
    alwaysOnTop: false,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    icon: path.join(__dirname, "assets/icons/ic_logo"), // set path here
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  // Position the window at the top right corner of the screen
  const positioner = new Positioner(mainWindow);
  positioner.move("topRight");

  // Load the HTML file into the window
  mainWindow.loadFile("index.html");
}

// Function to handle application startup
function onAppReady() {
  // Enable auto-launch on startup if it's not already set
  if (!settings.getSync("autoLaunch")) {
    settings.setSync("autoLaunch", true);
    autoLauncher.enable();
  }

  // Ensure auto-launch is enabled
  autoLauncher
    .isEnabled()
    .then((isEnabled) => {
      if (!isEnabled) {
        autoLauncher.enable();
      }
    })
    .catch((err) => {
      console.error("Error checking auto-launch status:", err);
    });

  // Create the main window
  app.whenReady().then(() => {
    createWindow();
  });

  // Handle application activation (e.g., clicking on the dock icon on macOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}

ipcMain.on("close-widget", () => {
  mainWindow.close();
});

ipcMain.on("open-external-link", () => {
  shell.openExternal("https://www.youtube.com");
});

ipcMain.on("set-always-on-top", (event, isAlwaysOnTop) => {
  mainWindow.setAlwaysOnTop(isAlwaysOnTop);
  settings.setSync("alwaysOnTop", isAlwaysOnTop);
});

ipcMain.handle("get-always-on-top", () => {
  return settings.getSync("alwaysOnTop") || false;
});

// Function to handle window closing
function onWindowAllClosed() {
  if (process.platform !== "darwin") {
    app.quit();
  }
}

// Function to handle web contents creation (e.g., opening links in the default browser)
function onWebContentsCreated(event, contents) {
  contents.on("will-navigate", (event, url) => {
    // Prevent navigation within the Electron app and open the link in the default browser
    event.preventDefault();
    shell.openExternal(url);
  });
}

// Application event listeners
app.on("ready", onAppReady);
app.on("window-all-closed", onWindowAllClosed);
app.on("web-contents-created", onWebContentsCreated);
