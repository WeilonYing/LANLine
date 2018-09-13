import * as dgram from 'dgram';
import * as ip from 'ip';
import { Settings } from './Settings';
import { DataService } from './DataService';
import { Payload, PayloadJSON, PayloadUtils } from './Payload';


export class NetworkManager {
  client: dgram.Socket = dgram.createSocket('udp4');
  server: dgram.Socket = dgram.createSocket('udp4');
  isHeartbeating: boolean = false;

  broadcastAddr: string;
  dataService: DataService;

  constructor(dataService: DataService) {
    // TODO: Add an option to choose a network interface to broadcast to.
    this.broadcastAddr = ip.or(ip.address(), ip.not(ip.fromPrefixLen(24)));
    console.log("Broadcast address: " + this.broadcastAddr);

    if (dataService === null) {
      throw new ReferenceError("dataService cannot be null");
    }
    this.dataService = dataService;

    this.server.on("listening", function() {
      console.log("Server is listening...");
    });
    this.server.on('message', (msg: string, rinfo: any) => {
      console.log("Received message " + msg);
    });

    this.server.bind(Settings.PORT, () => {
      this.server.setBroadcast(true);
    });
  }

  public heartbeat(): void { //TODO: set this to private once startHeartbeat is implemented
    let payload: Payload = {
      uuid: this.dataService.getId(),
      type: 'payload',
      timestamp: new Date(),
      nickname: this.dataService.getNickname()
    };
    let payloadJsonStr: string = JSON.stringify(PayloadUtils.payloadToJson(payload));
    this.server.send(
      payloadJsonStr, 0, payloadJsonStr.length, Settings.PORT, this.broadcastAddr);

    console.log("Sending heartbeat with content: " + payloadJsonStr); // DEBUG
  }

  public startHeartbeat(): void {
    if (this.isHeartbeating) {
      return;
    }
    this.isHeartbeating = true;

    setInterval(() => this.heartbeat(), Settings.HEARTBEAT_INTERVAL);
  }
}
