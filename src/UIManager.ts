import { Payload } from './Payload';
import { DataService } from './DataService';
import { User } from './User';

export class UIManager {

  message: string;
  receivedBroadcast: string;
  mainWindow: Electron.BrowserWindow;
  dataService: DataService;

  public setMainWindow(mainWindow: Electron.BrowserWindow): void {
    this.mainWindow = mainWindow;
  }

  public getMainWindow(): Electron.BrowserWindow {
    return this.mainWindow;
  }

  // Send message to screen
  public displayMessage(message: Payload, isSelf: boolean, channel: string): void {
    this.mainWindow.webContents.send('received_message', message, isSelf, channel, this.mainWindow.isFocused());
  }

  // Show online users on screen
  public showOnlineUsers(onlineUsers: User[], uuid: string): void {
    this.mainWindow.webContents.send('show_online_users', onlineUsers, uuid);
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
  
  // Display the user nickname on the screen
  public displayNickname(nickname: string): void {
    this.mainWindow.webContents.send('display_nickname', nickname);
  }

  public getMyNickname() {
    return this.dataService.getNickname();
  }
}