import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as dgram from "dgram";

class NetworkManager {
  client: dgram.Socket = dgram.createSocket('udp4');
  server: dgram.Socket = dgram.createSocket('udp4');
  constructor() {
    this.server.on("listening", function() {
      console.log("Server is listening...");
    });
    this.server.on('message', (msg: string, rinfo: any) => {
      console.log("Received message " + msg);
    });

    this.server.bind(40000, ()  => {
      this.server.setBroadcast(true);
    });
  }

  heartbeat(): void {
    let message: string = "test message";

    let ip = require('ip');
    let broadcastAddr = ip.or(ip.address(), ip.not(ip.fromPrefixLen(24)));

    this.server.send(
      message, 0, message.length, 40000, broadcastAddr);
  }
}

let mainWindow: Electron.BrowserWindow;
let networkManager: NetworkManager = new NetworkManager();

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('start_scan', () => {
  console.log("Beginning scan...");
  networkManager.heartbeat();
});
