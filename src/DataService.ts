import { Payload } from './Payload';

export class DataService {
  public getId(): string {
    return "angela";
    // TODO: implement ID storage and generator
  }

  public getNickname(): string {
    return "Angela";
    // TODO: implement nickname creation and retrieval
  }
  
  // Messages are simply stored in a hashmap for now, for testing purposes only
  messages: { [uuid: string]: Payload[] } = {};
  
  public getMessages(uuid: string): Payload[] {
    if (!this.messages[uuid]) {
      return [];
    }
    return this.messages[uuid];
    
    // TODO: implement message retrieval from the database
  }
  
  public storeMessage(payload: Payload): void {
    if (!this.messages[payload.uuid]) {
      this.messages[payload.uuid] = [];
    }
    this.messages[payload.uuid].push(payload);
  }
  
  // TODO: implement message storage to the database
}
