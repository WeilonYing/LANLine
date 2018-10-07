import { Payload } from './Payload';
import { User } from './User';

export class DataService {
  public getId(): string {
    return "angela";
    // TODO: implement ID storage and generator
  }

  public getNickname(): string {
    return "Angela";
    // TODO: implement nickname creation and retrieval
  }

  public getBlockedUsers(): User[]  {
    let user1 :User = {
      uuid: "teresa",
      nickname: "teresa",
      ip: "10.1.1",
      lastHeard: new Date(),
      blockedList: []
    };

    return [user1];
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
  
  /* Store message in chat history associated with the provided UUID */
  public storeMessage(uuid: string, payload: Payload): void {
    if (!this.messages[uuid]) {
      this.messages[uuid] = [];
    }
    this.messages[uuid].push(payload);
  }
  
  // TODO: implement message storage to the database
}
