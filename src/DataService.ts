const sqlite3 = require('sqlite3').verbose();
import { Database } from 'sqlite3';
import {Payload, PayloadJSON, PayloadUtils} from './Payload';
import { User } from './User';
import { Settings } from './Settings';

export class DataService {
  private db: Database;
  nickname: string;

  constructor() {
    this.db = new sqlite3.Database("db.sqlite3");

    const messageTableSql = "CREATE TABLE IF NOT EXISTS messages( \
                    sender int,\
                    receiver int,\
                    isBroadcast boolean,\
                    nickname string,\
                    timestamp datetime,\
                    message string)";

    const userTableSql = "CREATE TABLE IF NOT EXISTS users(\
                    uuid string,\
                    ip string,\
                    lastHeartbeat datetime,\
                    nickname string,\
                    customNickname string,\
                    isOnline boolean,\
                    isBlocked boolean)";

    this.db.run(messageTableSql);
    this.db.run(userTableSql);

  }

  public getId(): string {
    return "MY_UUID";
    // TODO: implement ID storage and generator
  }

  public getPersonalNickname(): string {
    return this.nickname;
  }

  public setPersonalNickname(nickname: string): void {
  	this.nickname = nickname;
  }

  public getBroadcasts(from?: number, to?: number): Promise<Payload[]> {
    if (!from || !to) {
      from = 0;
      to = 10;
    }
    const sql: string = `SELECT q.* FROM (
                        SELECT * FROM messages
                        WHERE ISBROADCAST = true
                        ORDER BY timestamp DESC
                        LIMIT ?
                        OFFSET ?) q
                      ORDER BY q.timestamp ASC`;

    return new Promise((resolve, reject) => {
      const messages: Payload[] = [];
      this.db.each(sql, [to - from, from], (err, row) => {
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
      });
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
    const sql: string = `SELECT q.* FROM (
                        SELECT * FROM messages
                        WHERE (SENDER = ? OR RECEIVER = ?) AND ISBROADCAST = false
                        ORDER BY timestamp DESC
                        LIMIT ?
                        OFFSET ?) q
                      ORDER BY q.timestamp ASC`;

    return new Promise((resolve, reject) => {
      const messages: Payload[] = [];
      this.db.each(sql, [uuid, uuid, to - from, from], (err, row) => {
        if (err) {
          reject("sql failed: " + sql);
        } else {
          messages.push(PayloadUtils.jsonToPayload(
            {uuid: row.sender,
            type: "message",
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
      });
    });
  }

  /* Store message in chat history associated with the provided UUID */
  public storeMessage(p: Payload, sender: string, receiver: string): void {

    this.getUserNickname(p.uuid).then(nickname => {
      const sql = `INSERT INTO messages(sender, receiver, isBroadcast, nickname, timestamp, message) \
             VALUES(?, ?, ?, ?, ?, ?)`;
      this.db.run(sql , [sender, receiver, p.type === "broadcast", nickname, p.timestamp, p.message]);
    });
  }

  // adds a user to the database

  public addUser(u: User) {
    const sql = `INSERT INTO users(uuid, ip, lastHeartbeat, nickname, isOnline, isBlocked, customNickname) \
               VALUES(?, ?, ?, ?, ?, ?, ?)`;
    this.db.run(sql , [u.uuid, u.ip, u.lastHeartbeat, u.nickname, true, false, null]);
  }

  public getUser(uuid: string): Promise<User> {
    const sql = "SELECT * FROM users WHERE uuid = ?";
    return new Promise<User>((resolve, reject) => {
      this.db.get(sql, [uuid], (err, row) => {
        if (err) {
          reject("sql failed: " + sql);
        } else {
          if (row === undefined) {
            resolve(null);
          } else {
            const user: User = {
              uuid: row.uuid,
              nickname: row.nickname,
              customNickname: row.customNickname,
              isBlocked: row.isBlocked,
              ip: row.ip,
              lastHeartbeat: row.lastHeartbeat,
              isOnline: row.isOnline,
            };
            resolve(user);
          }
        }
      });
    });
  }

  public getUserIP(uuid: string): Promise<string> {
    const sql = "SELECT * FROM users WHERE uuid = ? AND isOnline = ?";
    return new Promise<string>((resolve, reject) => {
      this.db.get(sql, [uuid, true], (err, row) => {
        if (err) {
          reject("sql failed: " + sql);
        } else {
          if (row === undefined) {
            resolve(null);
          } else {
            resolve(row.ip);
          }
        }
      });
    });
  }

  public getUserNickname(uuid: string): Promise<string> {
    const sql = "SELECT nickname, customNickname FROM users WHERE uuid = ?";
    return new Promise<string>((resolve, reject) => {
      this.db.get(sql, [uuid], (err, row) => {
        if (err) {
          reject("sql failed: " + sql + err);
        } else {
          if (row === undefined) {
            reject("No user with this UUID");
          } else {
            resolve(row.customNickname ? row.customNickname : row.nickname);
          }
        }
      });
    });
  }

  public getOfflineUsers(): Promise<User[]> {
    const sql = "SELECT * FROM users WHERE isOnline = ?";
    const users: User[] = [];
    return new Promise<User[]>((resolve, reject) => {
      this.db.each(sql, [false], (err, row) => {
        if (err) {
          reject("sql failed: " + sql);
        } else {
          const u: User = {
            uuid: row.uuid,
            nickname: row.nickname,
            customNickname: row.customNickname,
            isBlocked: row.isBlocked,
            ip: row.ip,
            lastHeartbeat: row.lastHeartbeat,
            isOnline: row.isOnline,
          };
          users.push(u);
        }
      }, (err, n) => {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
    });
  }

  public getNonBlockedOnlineUsers(): Promise<User[]> {
    const sql = "SELECT * FROM users WHERE isBlocked = ? AND isOnline = ?";
    const users: User[] = [];
    return new Promise<User[]>((resolve, reject) => {
      this.db.each(sql, [false, true], (err, row) => {
        if (err) {
          reject("sql failed: " + sql);
        } else {
          const u: User = {
            uuid: row.uuid,
            nickname: row.nickname,
            customNickname: row.customNickname,
            isBlocked: row.isBlocked,
            ip: row.ip,
            lastHeartbeat: row.lastHeartbeat,
            isOnline: row.isOnline,
          };
          users.push(u);
        }
      }, (err, n) => {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
    });
  }

  public getNonBlockedOfflineUsers(): Promise<User[]> {
    const sql = "SELECT * FROM users WHERE isBlocked = ? AND isOnline = ?";
    const users: User[] = [];
    return new Promise<User[]>((resolve, reject) => {
      this.db.each(sql, [false, false], (err, row) => {
        if (err) {
          reject("sql failed: " + sql);
        } else {
          const u: User = {
            uuid: row.uuid,
            nickname: row.nickname,
            customNickname: row.customNickname,
            isBlocked: row.isBlocked,
            ip: row.ip,
            lastHeartbeat: row.lastHeartbeat,
            isOnline: row.isOnline,
          };
          users.push(u);
        }
      }, (err, n) => {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
    });
  }

  public updateUserHeartbeat(uuid: string, nickname: string, address: string, timeStamp: Date) {
    const sql = "UPDATE users SET nickname = ?, ip = ?, lastHeartbeat = ?, isOnline = ? WHERE uuid = ?";
    this.db.run(sql, [nickname, address, timeStamp, true, uuid]);
  }

  public updateUserCustomNickname(uuid: string, newNickname: string) {
    const sql = "UPDATE users SET customNickname = ? WHERE uuid = ?";
    this.db.run(sql, [newNickname, uuid]);
  }

  public timeoutOfflineUsers() {
    const sql = "UPDATE users SET isOnline = ? WHERE isOnline = ? AND ? - lastHeartbeat > ?";
    this.db.run(sql, [false, true, new Date(), Settings.ONLINE_USER_TIMEOUT]);
  }
}
