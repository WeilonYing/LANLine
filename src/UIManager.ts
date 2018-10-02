import { Payload } from './Payload';
import { DataService } from './DataService';
import { User } from './User';

export class UIManager {

	message: string;
	receivedBroadcast: string
  mainWindow: Electron.BrowserWindow
  dataService: DataService;

	// Used by NetworkManager
  public getMessage(): string {
    return this.message;
  }

  public getReceivedBroadcast(): string {
  	return this.receivedBroadcast;
  }

  // Used to get the message from form and set
  public setBroadcastMessage(broadcastMessage: string): void {
  	this.message = broadcastMessage;
  }

  public setMainWindow(mainWindow: Electron.BrowserWindow): void {
  	this.mainWindow = mainWindow;
  }

  public getMainWindow(): Electron.BrowserWindow {
    return this.mainWindow;
  }

  // Send message to screen
  public receiveBroadcast(broadcast: Payload, isSelf: boolean): void {
  	this.mainWindow.webContents.send('received_broadcast', broadcast, isSelf);
  	// console.log("broadcastJSON: " + broadcastJSON);
  }

  // Show online users on screen
  public showOnlineUsers(onlineUsers: User[], uuid: string): void {
  	this.mainWindow.webContents.send('show_online_users', onlineUsers, uuid);
  	// console.log("onlineUsers: " + onlineUsers[0].nickname);
  	// console.log("onlineUsers length: " + onlineUsers.length);
  }

  // Show offline users on screen
  public showOfflineUsers(offlineUsers: User[]): void {
  	this.mainWindow.webContents.send('show_offline_users', offlineUsers);
  }

  public getMyNickname(): string {
    return this.dataService.getNickname();
  }
  
  // Display messages on the screen
  public showMessages(messages: Payload[], ownUuid: string): void {
    this.mainWindow.webContents.send('show_messages', messages, ownUuid);
  }
}