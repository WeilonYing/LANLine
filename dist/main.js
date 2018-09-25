"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const NetworkManager_1 = require("./NetworkManager");
const DataService_1 = require("./DataService");
const UIManager_1 = require("./UIManager");
const UserManager_1 = require("./UserManager");
const Settings_1 = require("./Settings");
let mainWindow;
let networkManager;
let dataService = new DataService_1.DataService();
let uiManager = new UIManager_1.UIManager();
let userManager = new UserManager_1.UserManager();
function createWindow() {
    networkManager = new NetworkManager_1.NetworkManager(dataService, uiManager, userManager);
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        height: 600,
        width: 800,
        title: Settings_1.Settings.APPNAME
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
    uiManager.setMainWindow(mainWindow);
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on("ready", createWindow);
// Quit when all windows are closed.
electron_1.app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
electron_1.ipcMain.on('start_scan', () => {
    console.log("Beginning scan...");
    networkManager.startHeartbeat();
});
// send broadcast message
electron_1.ipcMain.on('send_broadcast', function (e, broadcastMessage) {
    uiManager.setBroadcastMessage(broadcastMessage);
    networkManager.sendBroadcastMessage();
});
//# sourceMappingURL=main.js.map