import { Payload } from './Payload';
import { DataService } from './DataService';
import { User } from './User';

export class UIManager {

  message: string;
  receivedBroadcast: string;
  mainWindow: Electron.BrowserWindow;
  dataService: DataService;

  constructor(dataService: DataService) {
    this.dataService = dataService;
  }

  public setMainWindow(mainWindow: Electron.BrowserWindow): void {
    this.mainWindow = mainWindow;
  }

  public getMainWindow(): Electron.BrowserWindow {
    return this.mainWindow;
  }

  // Send message to screen
  public displayMessage(message: Payload, isSelf: boolean, channel: string): void {
    this.dataService.getUserNickname(message.uuid).then((senderName) => {
      this.mainWindow.webContents.send('received_message', message, isSelf, channel, this.mainWindow.isFocused(), senderName);
    });
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
    return this.dataService.getPersonalNickname();
  }

  // Display messages on the screen
  public showMessages(messages: Payload[], ownUuid: string): void {
    this.mainWindow.webContents.send('show_messages', messages, ownUuid);
  }

  // Display the friend nickname on the header
  public displayFriendNickname(friendNickname: string): void {
    this.mainWindow.webContents.send('display_friend_nickname', friendNickname);
  }
  // Display the user's personal nickname on the screen
  public displayPersonalNickname(nickname: string): void {
    this.mainWindow.webContents.send('display_personal_nickname', nickname);
  }

  public displayLobbyHeader(): void {
    this.mainWindow.webContents.send('display_lobby_header');
  }


  // Display search results on screen
  public showSearchResults(messages: Payload[]): void {
    this.mainWindow.webContents.send('show_search_results', messages);
  }
}