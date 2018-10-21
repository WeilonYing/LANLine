import { Payload, PayloadJSON, PayloadUtils } from '../Payload';
import { Settings } from '../Settings';
import { UserManager } from '../UserManager';
import { User } from '../User';
import {DataService} from "../DataService";

process.env.test = "true";
jest.useFakeTimers();

let dataService: DataService = new DataService();
let userManager: UserManager = new UserManager(dataService);


let testHeartbeats: Payload[] = [
  {
    uuid: 'bae48971-4d4e-4157-8901-4b0c5cec37c8',
    type: 'heartbeat',
    timestamp: new Date(),
    nickname: 'whale'
  },
  {
    uuid: '1266c839-0511-437e-b609-fe594463be07',
    type: 'heartbeat',
    timestamp: new Date(),
    nickname: 'oshen'
  },
  {
    uuid: 'db12c714-e2bd-48b6-b59d-2b0ff45d25b3',
    type: 'heartbeat',
    timestamp: new Date(),
    nickname: 'asu'
  },
  {
    uuid: '070f6128-1ac6-41bc-aed9-cbc37f2377fd',
    type: 'heartbeat',
    timestamp: new Date(),
    nickname: 'tpham'
  }
];

let testRinfo = [ // NOTE: length must be >= length of testHeartbeats
  { address: '10.0.0.4' },
  { address: '10.0.0.5' },
  { address: '10.0.0.6' },
  { address: '10.0.0.7' }
]

/* Set user's last heard time to be outside of the timeout limit
function expireUser(user: User): void {
  user.lastHeard.setTime(user.lastHeard.getTime() - Settings.ONLINE_USER_TIMEOUT - 1);
}

beforeEach(() => {
  for (let i = 0; i < testHeartbeats.length; i++) {
    let payload: Payload = testHeartbeats[i];
    let rinfo: any = testRinfo[i];
    userManager.registerHeartbeat(payload, rinfo);
  }
});

describe('Test online users after their heartbeats registered', () => {
  test('getOnlineUser() to return user object given valid UUID and within the timeout limit', () => {
    let user: User = userManager.getOnlineUser('bae48971-4d4e-4157-8901-4b0c5cec37c8');
    expect(user).toBeTruthy();
    expect(user).not.toBeNull();
    expect(user).toBeDefined();
  });
  
  test('getOnlineUsers() to return a sufficient list of online users', () => {
    expect(userManager.getOnlineUsers([]).length).toEqual(testHeartbeats.length);
  });
  
  test('getOnlineUser() to return null given invalid UUID', () => {
    let user: User = userManager.getOnlineUser('bae48971-4d4e-4157-8901-4b0c5cec37c9');
    expect(user).toBeNull();
  });
  
  test('getOnlineUser() to return null given valid UUID and outside the timeout limit', () => {
    let uuid: string = 'bae48971-4d4e-4157-8901-4b0c5cec37c8';
    let user: User = userManager.getOnlineUser(uuid);
    
    expireUser(user);
    userManager.checkOnlineUsers();
    user = userManager.getOnlineUser(uuid);
    expect(user).toBeNull();
  })
});

describe('Test users in offline list after they have gone offline', () => {
  test('getOfflineUsers() to return empty list given all online users have not timed out', () => {
    expect(userManager.getOfflineUsers().length).toEqual(0);
  });
  
  test('getOfflineUsers() to return size one after a user is no longer online', () => {
    let uuid: string = 'bae48971-4d4e-4157-8901-4b0c5cec37c8';
    let user: User = userManager.getOnlineUser(uuid);
    
    userManager.removeOnlineUser(user);
    expect(userManager.getOfflineUsers().length).toEqual(1);
  });
});*/

afterAll(() => {
  userManager.stopCheckOnlineUsers();
});
