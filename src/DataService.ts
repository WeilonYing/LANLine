const sqlite3 = require('sqlite3').verbose();
import { Database } from 'sqlite3';
import { Payload, PayloadUtils } from './Payload';

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

  /* From and to represent the message interval. E.g. if from is 0, start from most recent message */
  public getMessages(uuid: string, from?: number, to?: number): Promise<Payload[]> {

    if (!from || !to) {
      from = 0;
      to = 10;
    }

  	let sql = 'SELECT * FROM messages\
                WHERE UUID = ?\
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
            type: row.isBroadcast ? 'broadcast':'message',
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
  public storeMessage(uuid: string, payload: Payload): void {
  	this.db.run(`INSERT INTO messages(UUID, isBroadcast, nickname, timestamp, message)
  					VALUES(?, ?, ?, ?, ?)`,
  					[uuid, payload.type==='broadcast', payload.nickname, payload.timestamp, payload.message]);
  }

}
