import { dialog } from 'electron';

import { DataService } from '../DataService';
import { NetworkManager } from '../NetworkManager';
import { UIManager } from '../UIManager';
import { UserManager } from '../UserManager';

process.env.test = "true";

let dataService: DataService = new DataService();
let uiManager: UIManager = new UIManager(dataService);
let userManager: UserManager = new UserManager(dataService);
NetworkManager.prototype.getIPAddress = jest.fn().mockReturnValue("10.0.0.4");
let networkManager: NetworkManager = new NetworkManager(
    dataService, uiManager, userManager);

describe("Boilerplate", () => {
  beforeEach(() => {
    
    
  });
  test('something', () => {
    expect(true).toEqual(true);
  });
});

afterAll(() => {
  networkManager.server.close();
  networkManager.client.close();
  userManager.stopCheckOnlineUsers();
})