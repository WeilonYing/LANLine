const sqlite3 = require('sqlite3').verbose();
import { Database } from 'sqlite3';
import { Payload, PayloadJSON, PayloadUtils } from '../Payload';
import { Settings } from '../Settings';
import { UserManager } from '../UserManager';
import { User } from '../User';
import {DataService} from "../DataService";

process.env.test = "true";

let dataService: DataService = new DataService();
let userManager: UserManager;

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

let addresses = [ // NOTE: length must be >= length of testHeartbeats
  '10.0.0.4',
  '10.0.0.5',
  '10.0.0.6',
  '10.0.0.7'
]

/* Set user's last heard time to be outside of the timeout limit */
function expireUser(user: User): void {
  user.lastHeartbeat.setTime(user.lastHeartbeat.getTime() - Settings.ONLINE_USER_TIMEOUT - 1);
  dataService.updateUserHeartbeat(user.uuid, user.nickname, user.ip, user.lastHeartbeat);
}

function registerHeartbeats(index: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (index >= testHeartbeats.length) {
      resolve(); 
    }
    let payload: Payload = testHeartbeats[index];
    let ip: string = addresses[index];
    userManager.registerHeartbeat(payload, ip).then(() => {
      registerHeartbeats(index + 1).then(() => {
        resolve();
      })
    })
  })
}

beforeAll(() => {
  jest.useFakeTimers();
  userManager = new UserManager(dataService);
  return registerHeartbeats(0);
});

afterAll(() => {
  userManager.stopCheckOnlineUsers();
  let db: Database;
  db = new sqlite3.Database('db.sqlite3');
  db.run('DELETE FROM messages', []);
  db.run('DELETE FROM users', []);
});


describe('Test online users after their heartbeats registered', () => {
  test('getOnlineUserIP() to return user object given valid UUID and within the timeout limit', () => {
    return userManager.getOnlineUserIP('bae48971-4d4e-4157-8901-4b0c5cec37c8').then((userIP: string) => {
      expect(userIP).toBeTruthy();
      expect(userIP).not.toBeNull();
      expect(userIP).toBeDefined();
    });
    
  });
  
  test('getOnlineUserIP() to return null given invalid UUID', () => {
    return userManager.getOnlineUserIP('bae48971-4d4e-4157-8901-4b0c5cec37c9').then((userIP: string) => {
      expect(userIP).toBeNull();
    });
  });
  
  test('getNonBlockedOnlineUsers() to return a sufficient list of online users', () => {
    return userManager.getNonBlockedOnlineUsers().then((users: User[]) => {
      expect(users.length).toEqual(testHeartbeats.length);
    });
  });
  
  
  test('getOnlineUserIP() to return null given valid UUID and outside the timeout limit', () => {
    let user: User;
    return userManager.getNonBlockedOnlineUsers().then((users: User[]) => {
      user = users[0];
      expireUser(users[0]);
      userManager.timeoutOfflineUsers().then(() => {
        userManager.getOnlineUserIP(user.uuid).then((userIP: string) => {
          expect(userIP).toBeNull();
        });
      });
    });
  });
});

describe('Test users in offline list after they have gone offline', () => {
  test('getOfflineUsers() to return size one after a user is no longer online', () => {
    let user: User;
    return userManager.getNonBlockedOnlineUsers().then((users: User[]) => {
      user = users[0];
    }).then(() => {
      expireUser(user);
      userManager.timeoutOfflineUsers();
      userManager.getOfflineUsers().then((users: User[]) => {
        expect(users.length).toBe(1);
      });
    });
  });
});

