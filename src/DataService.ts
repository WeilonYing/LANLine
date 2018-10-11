const sqlite3 = require('sqlite3').verbose();
import { Database } from 'sqlite3';
import { Payload, PayloadUtils } from './Payload';
import { User } from './User';

export class DataService {
	db: Database;

	constructor() {
		this.db = new sqlite3.Database('db.sqlite3');

    let messageTableSql = 'CREATE TABLE IF NOT EXISTS messages( \
                      UUID int,                                 \
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

  public getBroadcasts(from?: number, to?: number): Promise<Payload[]> {
    if (!from || !to) {
      from = 0;
      to = 10;
    }

  	let sql = 'SELECT * FROM messages\
                WHERE ISBROADCAST = true\
                ORDER BY timestamp ASC\
                LIMIT ?\
                OFFSET ?';

    return new Promise((resolve, reject) => {
      const messages : Payload[] = [];
      this.db.each(sql, [to-from, from], (err, row) => {
        if (err) {
          reject("sql failed: " + sql);
        } else {
          messages.push(PayloadUtils.jsonToPayload(
            {uuid: row.UUID,
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

  	let sql = 'SELECT * FROM messages\
                WHERE UUID = ? AND ISBROADCAST = false\
                ORDER BY timestamp ASC\
                LIMIT ?\
                OFFSET ?';

    return new Promise((resolve, reject) => {
      const messages : Payload[] = [];
      this.db.each(sql, [uuid, to-from, from], (err, row) => {
        if (err) {
          reject("sql failed: " + sql);
        } else {
          messages.push(PayloadUtils.jsonToPayload(
            {uuid: row.UUID,
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
  public storeMessage(payload: Payload): void {
  	this.db.run(`INSERT INTO messages(UUID, isBroadcast, nickname, timestamp, message)
  					VALUES(?, ?, ?, ?, ?)`,
  					[payload.uuid, payload.type==='broadcast', payload.nickname, payload.timestamp, payload.message]);
  }


}
