import { Payload } from './Payload';
import { Settings } from './Settings';
import { User } from './User';
import { DataService } from './DataService';

export class UserManager {
  private dataService: DataService;

  constructor(dataService: DataService) {
    // schedule checking of online users for a regular interval
    this.dataService = dataService;
    setInterval(() => this.timeoutOfflineUsers(), Settings.ONLINE_USER_TIMEOUT);
  }

  /**
   * Checks all online users if they have timed out. Removes a user from list of online users if they
   * have timed out
   */
  public timeoutOfflineUsers(): void {
    this.dataService.timeoutOfflineUsers();
  }

  /**
   * Gets an array containing currently online users.
   * Excludes users who are blocked
   */
  public getNonBlockedOnlineUsers(): Promise<User[]> {
    return this.dataService.getNonBlockedOnlineUsers();
  }

   /**
   * Gets an array containing currently offline users.
   * Excludes users who are blocked
   */
  public getNonBlockedOfflineUsers(): Promise<User[]> {
    return this.dataService.getNonBlockedOfflineUsers();
  }

  /**
   * Gets an array containing all currently offline users.
   */
  public getOfflineUsers(): Promise<User[]> {
    return this.dataService.getOfflineUsers();
  }

  /**
   * Get promise of user IP by uuid. Returns null if user doesn't exist or is not online.
   */
  public getOnlineUserIP(uuid: string) {
    return this.dataService.getUserIP(uuid);
  }

  /**
   * Updates online user list with information from the heartbeat.
   * Adds User to db if they are new
   */
  public registerHeartbeat(payload: Payload, address: string): void {

    // required to access dataService within promise.then
    this.dataService.getUser(payload.uuid).then((user) => {
      if (!user) {
        const u: User = {
          customNickname: null,
          ip: address,
          isBlocked: false,
          isOnline: true,
          lastHeartbeat: new Date(),
          nickname: payload.nickname,
          uuid: payload.uuid,
        };
        this.dataService.addUser(u);
      } else {
        this.dataService.updateUserHeartbeat(payload.uuid, payload.nickname, address, new Date());
      }
    });
  }
}
