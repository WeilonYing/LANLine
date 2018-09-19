import { Payload } from './Payload';
import { Settings } from './Settings';
import { User } from './User';


export class UserManager {
  //hashmap of online users. Key is string, value is User
  private onlineUsers: { [uuid: string] : User } = {};

  constructor() {
    // schedule checking of online users for a regular interval
    setInterval(() => this.checkOnlineUsers(), Settings.ONLINE_USER_TIMEOUT);
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
    let keys: string[] = Object.keys(this.onlineUsers);;
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
  public getOnlineUsers(): User[] {
    let users: User[] = [];
    for (let key in this.onlineUsers) {
      users.push(this.onlineUsers[key]);
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
        lastHeard: new Date()
      }
      this.addOnlineUser(newUser);
      return;
    }

    this.onlineUsers[payload.uuid].nickname = payload.nickname;
    this.onlineUsers[payload.uuid].ip = rinfo.address;
    this.onlineUsers[payload.uuid].lastHeard = new Date();
  }
}
