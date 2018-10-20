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

  // Display search results on screen
  public showSearchResults(messages: Payload[]): void {
    this.mainWindow.webContents.send('show_search_results', messages);
  }

  // TODO(Oliver): delete this once showSearchResults is complete (currently used for testing)
  public searchResults(): void {
    let payload1: Payload = {
      uuid: 'a',
      type: 'message',
      message: 'Message 1',
      timestamp: new Date(),
      nickname: 'Jungkook'
    };
    let payload2: Payload = {
      uuid: 'b',
      type: 'message',
      message: 'Message 2',
      timestamp: new Date(),
      nickname: 'Jimin'
    };
    let payload3: Payload = {
      uuid: 'c',
      type: 'message',
      message: 'Message 3',
      timestamp: new Date(),
      nickname: 'V'
    };
    let payload4: Payload = {
      uuid: 'd',
      type: 'message',
      message: 'Message 4',
      timestamp: new Date(),
      nickname: 'Namjoon'
    };
    var messages: Payload[] = [payload1, payload2, payload3, payload4];

    this.mainWindow.webContents.send('show_search_results', messages);
  }
}