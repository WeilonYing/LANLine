// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { ipcRenderer } from 'electron';
import { DataService } from './DataService';
import { Payload, PayloadJSON, PayloadUtils } from './Payload';

var msgCount = -1;

/* Start sending of heartbeat messages */
function start_scan(): void {
  console.log("scanning");
  ipcRenderer.send('start_scan');
}

/* Handle sending of broadcast message from the GUI to the main process */
function send_broadcast_message(e: any): void {
  if (e) {
    e.preventDefault(); // prevent default action (page reload) taking place if Enter/Return pressed
  }
  let messageElement: HTMLInputElement = <HTMLInputElement> document.getElementById('broadcastMessage');
  let broadcastMessage: string = messageElement.value;
  if (broadcastMessage.length > 0) {
  	// This part is currently used to process direct messages
	  // TODO: delete this part once MVC is created
	  let broadcastMessageSplit: string[] = broadcastMessage.split(' ');
	  let ipAddr: string = broadcastMessageSplit[0];
	  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddr)) {  
	  	let message: string[] = broadcastMessageSplit.slice(1, broadcastMessageSplit.length + 1);
	  	ipcRenderer.send('send_private_message', ipAddr, message);
	  	messageElement.value = '';
	  	return;
	  }
	  // end private message section 
    ipcRenderer.send('send_broadcast', broadcastMessage);
    messageElement.value = '';
  }
}

/* Handle display of broadcast message passed in from the main process */

ipcRenderer.on('received_broadcast', function(e: any, payload: Payload, fromSelf: boolean) {
  let newRow: HTMLElement = document.createElement('div');
  newRow.className = "message";
  document.getElementById('bubbles').appendChild(newRow);
  let newMessage: HTMLElement = document.createElement('div');
  newMessage.className = "chat-bubble ";
  if (fromSelf) { // display message depending on whether it's from our user or not
    newMessage.className += "chat-bubble__right";
  } else {
    newMessage.className += "chat-bubble__left";
  }
  newMessage.innerHTML = payload.nickname + "<span class=\"chat-name\">" + payload.message + "</span>";
  msgCount = msgCount + 1;
  document.getElementsByClassName('message')[msgCount].appendChild(newMessage);
});

// Add event listeners for sending broadcast messages
const broadcast_form: HTMLElement = document.querySelector('#send_broadcast')
const broadcast_input: HTMLInputElement = document.querySelector('#broadcastMessage');
broadcast_form.addEventListener('click', send_broadcast_message);
document.querySelector('form').addEventListener('submit', send_broadcast_message, false);
