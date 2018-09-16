import { User} from './User';


export class UserManager {
  //hashmap of online users. Key is string, value is User
  onlineUsers: { [uuid: string] : User } = {};

  public addOnlineUser(user: User): void {
    this.onlineUsers[user.uuid] = user;
  }

  public removeOnlineUser(user: User): void {
    delete this.onlineUsers[user.uuid];
  }

  public checkOnlineUsers(user: User): void {
    return null;
  }

  public getOnlineUsers(): User[] {
    return null;
  }
}
