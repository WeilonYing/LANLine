const sqlite3 = require('sqlite3').verbose();
import { Database } from 'sqlite3';
import { Payload } from './Payload';

export class DataService {
	db: Database;

	constructor() {
		this.db = new sqlite3.Database('db.sqlite3');
		this.db.run('CREATE TABLE IF NOT EXISTS messages(\
	           UUID int,\
	           broadcast boolean,\
	           timestamp datetime,\
	           message string)');
		this.db.run('CREATE TABLE IF NOT EXISTS users(\
						UUID int,\
						nickname string)');
	}

  public getId(): string {
    return "angela";
    // TODO: implement ID storage and generator
  }

  public getNickname(): string {
    return "Angela";
    // TODO: implement nickname creation and retrieval
  }

  /* From and to represent the message interval. E.g. if from is 0, start from most recent message */
  public getMessages(uuid: string, from?: number, to?: number): Payload[] {
  	if (!from && !to) {
  		return null;
  	}
    return null;
  }

  /* Store message in chat history associated with the provided UUID */
  public storeMessage(uuid: string, payload: Payload): void {
  }

}
