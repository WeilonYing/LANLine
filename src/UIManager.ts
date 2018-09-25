import { DataService } from './DataService';

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
  public receiveBroadcast(broadcastJSON: string): void {
  	this.mainWindow.webContents.send('received_broadcast', broadcastJSON);
  	// console.log("broadcastJSON: " + broadcastJSON);
  }

  public getMyNickname() {
    return this.dataService.getNickname();
  }
}