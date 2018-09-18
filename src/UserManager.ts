import { Payload } from './Payload';
import { User } from './User';


export class UserManager {
  //hashmap of online users. Key is string, value is User
  private onlineUsers: { [uuid: string] : User } = {};

  public addOnlineUser(user: User): void {
    this.onlineUsers[user.uuid] = user;
  }

  public removeOnlineUser(user: User): void {
    delete this.onlineUsers[user.uuid];
  }

  public checkOnlineUsers(user: User): void {
    // TODO: automatically remove users not heard from for more than 30 seconds.
    return;
  }

  /**
  Gets a object containing all currently online users.
  */
  public getOnlineUsers(): User[] {
    return this.onlineUsers;
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

  public registerHeartbeat(payload: Payload, rinfo: JSON): void {
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
