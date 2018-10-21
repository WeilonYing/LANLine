import { Payload } from './Payload';
import { Settings } from './Settings';
import { User } from './User';
import { DataService } from './DataService';

export class UserManager {
  //hashmap of online users. Key is string, value is User
  private onlineUsers: { [uuid: string] : User } = {};
  private allUsers: { [uuid: string] : User } = {};
  private dataService: DataService;

  constructor() {
    // schedule checking of online users for a regular interval
    setInterval(() => this.checkOnlineUsers(), Settings.ONLINE_USER_TIMEOUT);
  }

  public addUser(user: User): void {
    this.allUsers[user.uuid] = user;
  }

  public addOnlineUser(user: User): void {
    this.onlineUsers[user.uuid] = user;
  }

  public removeOnlineUser(user: User): void {
    delete this.onlineUsers[user.uuid];
  }

  /**
  Checks all online users if they have timed out. Removes a user from list of online users if they
  have timed out
  */
  public checkOnlineUsers(): void {
    let keys: string[] = Object.keys(this.onlineUsers);
    for (let i = 0; i < keys.length; i++) {
      let user: User = this.onlineUsers[keys[i]];
      let lastHeardDiff: number = (new Date().valueOf()) - user.lastHeard.valueOf(); // diff in milliseconds
      if (lastHeardDiff > Settings.ONLINE_USER_TIMEOUT) {
        this.removeOnlineUser(user);
      }
    }
  }

  /**
  Gets an array containing all currently online users.
  */
  public getOnlineUsers(blockedUsers: User[]): User[] {
    // Begin test code
    let user1: User = {
      uuid: "teresa",
      nickname: "teresa",
      ip: "10.1.1",
      lastHeard: new Date(),
      blockedList: []
    };
    
    let user2: User = {
      uuid: "weilon",
      nickname: "weilon",
      ip: "10.1.2",
      lastHeard: new Date(),
      blockedList: []
    };
    
    let users: User[] = [user1, user2];
    // End test code
    // let users: User[] = [];

    // for (let key in this.onlineUsers) {
    //   users.push(this.onlineUsers[key]);
    // }

    // for (let i = 0; i < users.length; i++) {
    //   for (let j = 0; j < blockedUsers.length; j++) {
    //     if (users[i].uuid == blockedUsers[j].uuid) {
    //       delete users[i];
    //     }
    //   }
    // }
    
    return users;
  }

  /**
  Gets an array containing all currently offline users.
  */
  public getOfflineUsers(): User[] {
    let users: User[] = [];
    for (let key in this.allUsers) {
      if (this.onlineUsers[key] == undefined) {
        users.push(this.allUsers[key]);
      }
    }
    return users;
  }

  /**
  Get user object by uuid. Returns null if user doesn't exist or is not online.
  */
  public getOnlineUser(uuid: string) {
    if (!this.onlineUsers[uuid]) {
      return null;
    }
    return this.onlineUsers[uuid];
  }

  /**
  Updates online user list with information from the heartbeat.
  */
  public registerHeartbeat(payload: Payload, rinfo: any): void {
    if (!this.onlineUsers[payload.uuid]) {
      let newUser: User = {
        uuid: payload.uuid,
        nickname: payload.nickname,
        ip: rinfo.address,
        lastHeard: new Date(),
        blockedList: []
      }
      this.addOnlineUser(newUser);
      this.addUser(newUser);
      return;
    }

    this.onlineUsers[payload.uuid].nickname = payload.nickname;
    this.onlineUsers[payload.uuid].ip = rinfo.address;
    this.onlineUsers[payload.uuid].lastHeard = new Date();
  }
}
