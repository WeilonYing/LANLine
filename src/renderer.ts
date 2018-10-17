// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { ipcRenderer } from 'electron';
import { Payload, PayloadJSON, PayloadUtils } from './Payload';
import { Settings } from './Settings';
import { User } from './User';

const BUBBLE_CLASS_NAME: string = 'bubbles';
const MSG_CLASS_NAME: string = 'message';

var msgCount: number = -1;
var isChangingView: boolean = false;
var currentViewChannel: string = Settings.LOBBY_ID_NAME;

/* Initialisation function for the renderer process */
function init(): void {
  // Add event listeners for sending broadcast messages
  const send_message_button: HTMLElement = document.querySelector('#sendMessage');
  send_message_button.addEventListener('click', send_message);
  document.querySelector('form').addEventListener('submit', send_message, false);

  // Add event listener for lobby navigation button on the sidebar
  const lobby_button: HTMLElement = document.querySelector('#' + Settings.LOBBY_ID_NAME);
  lobby_button.addEventListener('click', () => { setMessageView(Settings.LOBBY_ID_NAME); });

  setMessageView(); // Set up message view for the first time.
}

/* Start sending of heartbeat messages */
function start_scan(): void {
  console.log("scanning");
  ipcRenderer.send('start_scan');
}

/* Handle sending of broadcast message from the GUI to the main process */
function send_message(e: any): void {
  if (e) {
    e.preventDefault(); // prevent default action (page reload) taking place if Enter/Return pressed
  }
  let messageElement: HTMLInputElement = <HTMLInputElement> document.getElementById('messageInput');
  let message: string = messageElement.value;
  if (message.length > 0) {
	  	ipcRenderer.send('send_message', currentViewChannel, message);
	  	messageElement.value = '';
  }
}

/* Add a chat bubble message to the screen */
function addMessageToView(payload: Payload, fromSelf: boolean) {
  let newRow: HTMLDivElement = document.createElement('div');
  newRow.className = MSG_CLASS_NAME;
  document.getElementById(BUBBLE_CLASS_NAME).appendChild(newRow); // append row to message view

  let newContainer: HTMLDivElement = document.createElement('div');
  newContainer.className = "chat-container ";
  newRow.appendChild(newContainer);

  let newDeleteButton: HTMLAnchorElement = document.createElement('a');
  newDeleteButton.innerHTML = "x";
  newDeleteButton.className = "chat-delete "; // TODO: Properly style the delete button
  newDeleteButton.addEventListener('click', () => {
    newRow.parentNode.removeChild(newRow);
    // TODO: Call delete message in DB
    // TODO: Create confirmation button
  });
  newContainer.appendChild(newDeleteButton);

  let newMessage: HTMLDivElement = document.createElement('div');
  newMessage.className = "chat-bubble ";
  if (fromSelf) { // display message depending on whether it's from our user or not
    newMessage.className += "chat-bubble__right";
    newContainer.className += "chat-container__right";
    newDeleteButton.className += "chat-delete__left"; // put delete button to left of bubble
    newMessage.title = "Sent at ";
  } else {
    newMessage.className += "chat-bubble__left";
    newContainer.className += "chat-container__left";
    newDeleteButton.className += "chat-delete__right"; // put delete button to right of bubble
    newMessage.title = "Received at ";
  }
  newMessage.innerHTML = payload.nickname + "<span class=\"chat-name\">" + payload.message + "</span>";
  msgCount = msgCount + 1;

  let timestamp: Date = new Date(payload.timestamp);
  newMessage.title += timestamp.toLocaleString();

  newContainer.appendChild(newMessage); // add message to row
}

/* Remove all displayed messages on the screen */
function clearMessageView(): void {
  // best way to clear up a view according to Stack Overflow https://stackoverflow.com/a/22966637
  let bubbleNode: HTMLElement = document.getElementById(BUBBLE_CLASS_NAME);
  let newBubbleNode: HTMLElement = <HTMLElement> bubbleNode.cloneNode(/* deep clone */ false);
  bubbleNode.parentNode.replaceChild(newBubbleNode, bubbleNode);
  msgCount = -1;
}

/* Show all messages sent and received from a specific user */
function setMessageView(uuid?: string): void {
  if (!uuid) {
    uuid = currentViewChannel;
  }
  clearMessageView();
  currentViewChannel = uuid;
  ipcRenderer.send('retrieve_messages', uuid);
}

/**
  Inter-process communication from main process
 */

/* Display messages sent and received */
ipcRenderer.on('show_messages', function(e: any, messages: Payload[], ownUuid: string) {
  for (let i = 0; i < messages.length; i++) {
    let message: Payload = messages[i];
    addMessageToView(message, message.uuid === ownUuid);
  }
});

/* Show online users on sidebar by dynamically creating elements based on list */
ipcRenderer.on('show_online_users', function(e: any, onlineUsers: User[], uuid: string) {
  document.getElementById("own-nickname").innerHTML = uuid; // TODO: Properly display the nickname

	// Every time this function is called, clear the div and regenerate everything
	// inside it.
	document.getElementById("online-list").innerHTML = "";
	for (let i = 0; i < onlineUsers.length; i++) {
		if (onlineUsers[i].uuid === uuid) {
			// if it's yourself, don't display
			continue;
		}

		let online: HTMLElement = document.getElementById("online-list");
		let list: HTMLLIElement = document.createElement("li");
		list.className = "side-nav__item";
		let link: HTMLAnchorElement = document.createElement("a");
		link.className = "side-nav__link";
		let innerDiv: HTMLElement = document.createElement("div");
		innerDiv.className = "side-nav__container";
		let spanName: HTMLSpanElement = document.createElement("span");
		let name: Text = document.createTextNode(onlineUsers[i].nickname);
		spanName.appendChild(name);
		innerDiv.appendChild(spanName);
		link.appendChild(innerDiv);
		link.href = "#"; // this should eventually link to the correct tab
    link.addEventListener('click', () => {
      setMessageView(onlineUsers[i].uuid);
    });
		list.appendChild(link);
		online.appendChild(list);
	}
});

/* Show offline users on sidebar by dynamically creating elements based on list */
ipcRenderer.on('show_offline_users', function(e: any, offlineUsers: User[]) {
	// Every time this function is called, clear the div and regenerate everything
	// inside it.
	document.getElementById("offline-list").innerHTML = "";
	for (var i = 0; i < offlineUsers.length; i++) {
		let offline: HTMLElement = document.getElementById("offline-list");
		let list: HTMLLIElement = document.createElement("li");
		list.className = "side-nav__container side-nav__offline--item";
		let link: HTMLAnchorElement = document.createElement("a");
		link.className = "side-nav__link";
		link.href = "#"; // this should eventually link to the correct tab
		let name: Text = document.createTextNode(offlineUsers[i].nickname);
		list.appendChild(name);
		link.appendChild(list);
		offline.appendChild(link);
	}
});

/* Handle display of message passed in from the main process */
ipcRenderer.on('received_message', function(e: any, payload: Payload, fromSelf: boolean, channel: string, isFocused: boolean) {
  if (currentViewChannel === channel) {
    addMessageToView(payload, fromSelf);
  }
  if ((currentViewChannel !== channel && !fromSelf) || !isFocused) {
    ipcRenderer.send('send_notification', payload.nickname, payload.message);
  }
});

init();
