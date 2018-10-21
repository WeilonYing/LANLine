export interface User {
  uuid: string;
  customNickname: string;
  nickname: string;
  ip: string;
  lastHeartbeat: Date;
  isOnline: boolean;
  isBlocked: boolean;
}
