import * as dgram from 'dgram';
import * as ip from 'ip';
import { Settings } from './Settings';

export class NetworkManager {
  client: dgram.Socket = dgram.createSocket('udp4');
  server: dgram.Socket = dgram.createSocket('udp4');
  broadcastAddr: string;
  isHeartbeating: boolean = false;

  constructor() {
    //let ip = require('ip');
    this.broadcastAddr = ip.or(ip.address(), ip.not(ip.fromPrefixLen(24)));

    this.server.on("listening", function() {
      console.log("Server is listening...");
    });
    this.server.on('message', (msg: string, rinfo: any) => {
      console.log("Received message " + msg);
    });

    this.server.bind(Settings.PORT, ()  => {
      this.server.setBroadcast(true);
    });
  }

  public heartbeat(): void { //TODO: set this to private once startHeartbeat is implemented
    let message: string = "test message";
    this.server.send(
      message, 0, message.length, Settings.PORT, this.broadcastAddr);
  }

  public startHeartbeat(): void {
    if (this.isHeartbeating) { return; }
    this.isHeartbeating = true;

    // implement this
  }
}
