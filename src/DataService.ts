const sqlite3 = require('sqlite3').verbose();
import { Database } from 'sqlite3';
import { Payload, PayloadUtils } from './Payload';
import { User } from './User';

export class DataService {
	db: Database;
  nickname: string;

	constructor() {
		this.db = new sqlite3.Database('db.sqlite3');

    let messageTableSql = 'CREATE TABLE IF NOT EXISTS messages( \
                      sender int,                               \
                      receiver int,                             \
                      isBroadcast boolean,                      \
                      nickname string,                          \
                      timestamp datetime,                       \
                      message string)'
    let userTableSql = 'CREATE TABLE IF NOT EXISTS users(       \
                      UUID int,                                 \
                      nickname string)'

		this.db.run(messageTableSql);
		this.db.run(userTableSql);

	}

  public getId(): string {
    return "goldfish";
    // TODO: implement ID storage and generator
  }

  public getNickname(): string {
    if (this.nickname == undefined) {
      this.nickname = "defaultNickname";
    }
    return this.nickname;
    // TODO: implement nickname creation and retrieval
  }

  public setUserNickname(nickname: string): void {
  	this.nickname = nickname;
  }

  public getBlockedUsers(): User[]  {
    // Begin debug code
    let user1 :User = {
      uuid: "teresa",
      nickname: "teresa",
      ip: "10.1.1",
      lastHeard: new Date(),
      blockedList: []
    };
    // End debug code
    return [user1];
  }

  public getBroadcasts(from?: number, to?: number): Promise<Payload[]> {
    if (!from || !to) {
      from = 0;
      to = 10;
    }

  	let sql: string = `SELECT q.* FROM (
                        SELECT * FROM messages
                        WHERE ISBROADCAST = true
                        ORDER BY timestamp DESC
                        LIMIT ?
                        OFFSET ?) q
                      ORDER BY q.timestamp ASC`;

    return new Promise((resolve, reject) => {
      const messages : Payload[] = [];
      this.db.each(sql, [to-from, from], (err, row) => {
        if (err) {
          reject("sql failed: " + sql);
        } else {
          messages.push(PayloadUtils.jsonToPayload(
            {uuid: row.sender,
            type: 'broadcast',
            timestamp: row.timestamp,
            nickname: row.nickname,
            message: row.message}));
        }
      }, (err, n) => {
        if (err) {
          reject(err);
        } else {
          resolve (messages);
        }
      })
    });
  }

  /*
    Get messages from database.
    From and to represent the message interval.
    E.g. if from is 0, start from most recent message
  */
  public getMessages(uuid: string, from?: number, to?: number): Promise<Payload[]> {

    if (!from || !to) {
      from = 0;
      to = 10;
    }

  	let sql: string = `SELECT q.* FROM (
                        SELECT * FROM messages
                        WHERE (SENDER = ? OR RECEIVER = ?) AND ISBROADCAST = false
                        ORDER BY timestamp DESC
                        LIMIT ?
                        OFFSET ?) q
                      ORDER BY q.timestamp ASC`;

    return new Promise((resolve, reject) => {
      const messages : Payload[] = [];
      this.db.each(sql, [uuid, uuid, to-from, from], (err, row) => {
        if (err) {
          reject("sql failed: " + sql);
        } else {
          messages.push(PayloadUtils.jsonToPayload(
            {uuid: row.sender,
            type: 'message',
            timestamp: row.timestamp,
            nickname: row.nickname,
            message: row.message}));
        }
      }, (err, n) => {
        if (err) {
          reject(err);
        } else {
          resolve (messages);
        }
      })
    });
  }

  /* Store message in chat history associated with the provided UUID */
  public storeMessage(payload: Payload, sender: string, receiver: string): void {
  	this.db.run(`INSERT INTO messages(sender, receiver, isBroadcast, nickname, timestamp, message)
  					VALUES(?, ?, ?, ?, ?, ?)`,
  					[sender, receiver, payload.type==='broadcast', payload.nickname, payload.timestamp, payload.message]);
  }


}
