import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as notifier from 'node-notifier';
import { NetworkManager } from './NetworkManager';
import { DataService } from './DataService';
import { UIManager } from './UIManager';
import { UserManager } from './UserManager';
import { Settings } from './Settings';
import {User} from "./User";

let mainWindow: Electron.BrowserWindow;
let networkManager: NetworkManager;
let dataService: DataService = new DataService();
let uiManager: UIManager = new UIManager(dataService);
let userManager: UserManager = new UserManager(dataService);

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    title: Settings.APPNAME
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
  networkManager = new NetworkManager(dataService, uiManager, userManager);
  networkManager.startHeartbeat();
}

// This method will be called when Electron has finished
// basic initialisation
app.on("will-finish-launching", () => {
  // Electron bug workaround (https://github.com/electron/electron/issues/12820)
  app.disableHardwareAcceleration();
});
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
  networkManager.startHeartbeat();
});

// send private message
ipcMain.on('send_message', function(e: any, uuid: string, message: string) {
  if (uuid === Settings.LOBBY_ID_NAME) {
    networkManager.sendBroadcastMessage(message);
  } else {
    networkManager.sendPrivateMessage(uuid, message);
  }
});

// get search results from database
ipcMain.on('get_search_results', function(e: any, searchTerm: string, uuid: string) {
  dataService.getSearchResults(searchTerm, uuid).then(function(result) {
    uiManager.showSearchResults(result);
  });
});

// send notification
ipcMain.on('send_notification', function(e: any, nickname: string, message: string) {
  notifier.notify({
    icon: path.join('favicon.png'),
    title: nickname,
    message: message
  });
});

// retrieve messages sent to and from a specific user
ipcMain.on('retrieve_messages', function(e: any, uuid: string) {
  if (uuid === Settings.LOBBY_ID_NAME) {
    dataService.getBroadcasts().then(function(result) {
    	uiManager.showMessages(result, dataService.getId());
    });
  } else {
    dataService.getMessages(uuid).then(function(result) {
    	uiManager.showMessages(result, dataService.getId());
    });
  }
});

// display friend's nickname on header
ipcMain.on('display_friend_nickname', function(e: any, friendNickname: string) {
  uiManager.displayFriendNickname(friendNickname);
});

ipcMain.on('display_lobby_header', function (e: any) {
  uiManager.displayLobbyHeader();
});

// Change the friend's nickname in the database and change the friend's nickname
// on the header and sidebar

ipcMain.on('set_friend_nickname', function(e: any, UUID: string, friendNicknameInput: string) {
  dataService.updateUserCustomNickname(UUID, friendNicknameInput);
  uiManager.displayFriendNickname(friendNicknameInput);

  userManager.getNonBlockedOnlineUsers().then((onlineUsers: User[]) => {
      uiManager.showOnlineUsers(onlineUsers, dataService.getId());
  });

  userManager.getNonBlockedOfflineUsers().then((offlineUsers: User[]) => {
      uiManager.showOfflineUsers(offlineUsers);
  });
});

// set new personal nickname
ipcMain.on('set_my_nickname', function(e: any, userNicknameInput: string) {
  dataService.setPersonalNickname(userNicknameInput);
  uiManager.displayPersonalNickname(userNicknameInput);
});
