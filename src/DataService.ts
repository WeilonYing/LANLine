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
  /* From and to represent the message interval. E.g. if from is 0, start from most recent message */
  public getMessages(uuid: string, from: number, to: number): Payload[] {
    return null;
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
