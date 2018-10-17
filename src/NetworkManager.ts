import * as dgram from 'dgram';
import { dialog } from 'electron';
import * as ip from 'ip';
import * as os from 'os';
import { Settings } from './Settings';
import { User } from './User';
import { DataService } from './DataService';
import { UIManager } from './UIManager';
import { UserManager } from './UserManager';
import { Payload, PayloadJSON, PayloadUtils } from './Payload';
import {AddressInfo} from "dgram";


export class NetworkManager {
  client: dgram.Socket = dgram.createSocket('udp4');
  server: dgram.Socket = dgram.createSocket('udp4');
  isHeartbeating: boolean = false;

  broadcastAddr: string;
  ipAddress: string;
  dataService: DataService;
  uiManager: UIManager;
  userManager: UserManager;


  constructor(dataService: DataService, uiManager: UIManager, userManager: UserManager) {
    this.broadcastAddr = ip.or(this.getIPAddress(), ip.not(ip.fromPrefixLen(24)));
    if (dataService === null) {
      throw new ReferenceError("dataService cannot be null");
    }
    this.dataService = dataService;

    if (uiManager === null) {
      throw new ReferenceError("uiManager cannot be null");
    }
    this.uiManager = uiManager;

    if (userManager === null) {
      throw new ReferenceError("userManager cannot be null");
    }
    this.userManager = userManager;

    console.log("Broadcast address: " + this.broadcastAddr); // DEBUG

    this.server.on("listening", function() {
      console.log("Server is listening...");
    });

    /*
      Handles incoming receipt of message data
     */
    this.server.on("message", (msg: string, addressInfo: AddressInfo) => {
      const msgJSON: PayloadJSON = JSON.parse(msg);
      const msgPayload: Payload = PayloadUtils.jsonToPayload(msgJSON);
      if (msgPayload.type === "heartbeat") {
        // received heartbeat
        this.userManager.registerHeartbeat(msgPayload, addressInfo.address);


        // display the user's nickname on the screen
        this.uiManager.displayPersonalNickname(this.dataService.getPersonalNickname());

        // update online users list
        this.userManager.getNonBlockedOnlineUsers().then((onlineUsers) => {
          this.uiManager.showOnlineUsers(onlineUsers, this.dataService.getId());
        });
        this.userManager.getNonBlockedOfflineUsers().then((offlineUsers) => {
          this.uiManager.showOfflineUsers(offlineUsers);
        });
        console.log(addressInfo);
        console.log("Received heartbeat " + msgPayload);
      } else if (msgPayload.type === 'broadcast') {
        // pass broadcast message to the UI
        if (msgPayload.uuid !== this.dataService.getId()) {
          uiManager.displayMessage(msgPayload, msgPayload.uuid === this.dataService.getId(), Settings.LOBBY_ID_NAME);
          this.dataService.storeMessage(msgPayload, msgPayload.uuid, this.dataService.getId()); // store broadcasts received from other users
        }
        console.log("received broadcast from " + msgPayload.nickname + ": " + msgPayload.message); // DEBUG
      } else if (msgPayload.type === 'message') {
        // received private message
        uiManager.displayMessage(msgPayload, msgPayload.uuid === this.dataService.getId(), msgPayload.uuid);
        this.dataService.storeMessage(msgPayload, msgPayload.uuid, this.dataService.getId());
        console.log("received message from " + msgPayload.nickname + ": " + msgPayload.message); // DEBUG
      }
    });
    if (process.env['test']) {
      return;
    }
    this.server.bind(Settings.PORT, () => {
      this.server.setBroadcast(true);
    });
  }

  /**
    Broadcasts a heartbeat signal to the entire local area network.
  */
  public heartbeat(): void { //TODO: set this to private once startHeartbeat is implemented
    let payload: Payload = {
      uuid: this.dataService.getId(),
      type: 'heartbeat',
      timestamp: new Date(),
      nickname: this.dataService.getPersonalNickname()
    };
    let payloadJsonStr: string = JSON.stringify(PayloadUtils.payloadToJson(payload));
    this.server.send(
      payloadJsonStr, 0, payloadJsonStr.length, Settings.PORT, this.broadcastAddr);

    console.log("Sending heartbeat with content: " + payloadJsonStr); // DEBUG
  }

  /**
    Schedules sending of heartbeat signals in regular intervals
  */
  public startHeartbeat(): void {
    if (this.isHeartbeating) {
      return;
    }
    this.isHeartbeating = true;

    setInterval(() => this.heartbeat(), Settings.HEARTBEAT_INTERVAL);
  }

  /**
    Create broadcast message package and send as a JSON string.
  */
  public sendBroadcastMessage(message_content: string): void {
    // Create the broadcast package
    let broadcastPayload: Payload = {
      uuid: this.dataService.getId(),
      type: 'broadcast',
      timestamp: new Date(),
      nickname: this.dataService.getPersonalNickname(),
      message: message_content
    }
    // Convert to a JSON string and send it to the broadcast address
    let broadcastPayloadJSON: PayloadJSON = PayloadUtils.payloadToJson(broadcastPayload);
    let broadcastPayloadString: string = JSON.stringify(broadcastPayloadJSON);

    this.uiManager.displayMessage(
      broadcastPayload, broadcastPayload.uuid === this.dataService.getId(), Settings.LOBBY_ID_NAME);

    this.server.send(
      broadcastPayloadString, 0, broadcastPayloadString.length, Settings.PORT, this.broadcastAddr);
    this.dataService.storeMessage(broadcastPayload, this.dataService.getId(), Settings.LOBBY_ID_NAME);
    console.log("sent broadcast: " + broadcastPayload.message); // DEBUG
  }

  /**
    Create private message package and send it to the given user
  */
  public sendPrivateMessage(recipient_uuid: string, message_content: string): void {
    // Create the message package
    let messagePayload: Payload = {
      uuid: this.dataService.getId(),
      type: 'message',
      timestamp: new Date(),
      nickname: this.dataService.getPersonalNickname(),
      message: message_content
    };

    var recipientIP;
    this.userManager.getOnlineUserIP(recipient_uuid).then((userIP) => {
      if (userIP === null) {
        // TODO: let user know that recipient is offline
      }
      recipientIP = userIP;
    });

    const messagePayloadJSON: PayloadJSON = PayloadUtils.payloadToJson(messagePayload);
    const messagePayloadString: string = JSON.stringify(messagePayloadJSON);

    this.uiManager.displayMessage(
      messagePayload, messagePayload.uuid === this.dataService.getId(), recipient_uuid);

    this.server.send(
      messagePayloadString, 0, messagePayloadString.length, Settings.PORT, recipientIP);
    //   messagePayloadString, 0, messagePayloadString.length, Settings.PORT, this.ipAddress);
    this.dataService.storeMessage(messagePayload, this.dataService.getId(), recipient_uuid);
    console.log("sent message " + messagePayload.message + " to " + recipientIP); // DEBUG
  }

  /**
    Gets the host's local IP address. If the user has more than one network interface, thie function
    opens a dialog box to select which interface's IP address to use.
    @return IP address
  */
  public getIPAddress(): string {
    if (process.env['test']) {
      return '192.168.1.10';
    }
    let interfaces: { [index: string]: os.NetworkInterfaceInfo[] } = os.networkInterfaces();
    let interfaceNames: string[] = Object.keys(interfaces);
    if (interfaceNames.length <= 1) {
      return ip.address(); // no need to show interface menu if only one interface available
    }

    let choice: number = dialog.showMessageBox(
      {
        type: 'question',
        title: Settings.APPNAME,
        message: 'Select a network interface to use',
        buttons: interfaceNames
      }
    );
    this.ipAddress = ip.address(interfaceNames[choice]);
    return ip.address(interfaceNames[choice]);
  }
}