import * as dgram from 'dgram';
import { dialog } from 'electron';
import * as ip from 'ip';
import * as os from 'os';
import { Settings } from './Settings';
import { DataService } from './DataService';
import { UIManager } from './UIManager';
import { Payload, PayloadJSON, PayloadUtils } from './Payload';


export class NetworkManager {
  client: dgram.Socket = dgram.createSocket('udp4');
  server: dgram.Socket = dgram.createSocket('udp4');
  isHeartbeating: boolean = false;

  broadcastAddr: string;
  dataService: DataService;
  uiManager: UIManager;


  constructor(dataService: DataService, uiManager: UIManager) {
    this.broadcastAddr = ip.or(this.getIPAddress(), ip.not(ip.fromPrefixLen(24)));
    if (dataService === null) {
      throw new ReferenceError("dataService cannot be null");
    }
    this.dataService = dataService;

    if (uiManager === null) {
      throw new ReferenceError("uiManager cannot be null");
    }
    this.uiManager = uiManager;

    console.log("Broadcast address: " + this.broadcastAddr);

    this.server.on("listening", function() {
      console.log("Server is listening...");
    });
    this.server.on('message', (msg: string, rinfo: any) => {
      let msgJSON: PayloadJSON = JSON.parse(msg);
      let msgPayload: Payload = PayloadUtils.jsonToPayload(msgJSON);
      if (msgJSON.type == 'heartbeat') {
        // received heartbeat
        console.log("Received heartbeat " + msg);
      } else if (msgJSON.type = 'broadcast') {
        // received broadcast
        console.log(msgPayload.nickname + ": " + msgPayload.message);
      }
    });

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
      nickname: this.dataService.getNickname()
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
  public sendBroadcastMessage(): void {
    // Create the broadcast package
    let broadcastPayload: Payload = {
      uuid: this.dataService.getId(),
      type: 'broadcast',
      timestamp: new Date(),
      nickname: this.dataService.getNickname(),
      message: this.uiManager.getMessage()
    }
    // Convert to a JSON string and send it to the broadcast address
    let broadcastPayloadJSON: PayloadJSON = PayloadUtils.payloadToJson(broadcastPayload);
    let broadcastPayloadString: string = JSON.stringify(broadcastPayloadJSON);
    this.server.send(
      broadcastPayloadString, 0, broadcastPayloadString.length, Settings.PORT, this.broadcastAddr);
  }

  /**
    Gets the host's local IP address. If the user has more than one network interface, thie function
    opens a dialog box to select which interface's IP address to use.
    @return IP address
  */
  private getIPAddress(): string {
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
    return ip.address(interfaceNames[choice]);
  }
}
