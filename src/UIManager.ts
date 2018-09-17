export class UIManager {

	message: string;

	// Used by NetworkManager
  public getMessage(): string {
    return this.message;
  }

  // Used to get the message from form and set
  public getBroadcastMessage(broadcastMessage: string): void {
  	this.message = broadcastMessage;
  }

}