export interface User {
  uuid: string;
  nickname: string;
  ip: string;
  lastHeard: Date;
  blockedList: User[];
}
