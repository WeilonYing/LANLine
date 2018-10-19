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

  // Add event listeners for getting the display nickname
  const user_nickname_form: HTMLElement = document.querySelector('#set_nickname')
  const user_nickname_input: HTMLInputElement = document.querySelector('#userNicknameInput');
  user_nickname_form.addEventListener('click', get_user_nickname);
  document.querySelector('form').addEventListener('submit', get_user_nickname);
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

/* Get the new user nickname entered into the form for the user */
function get_user_nickname(e: any): void {
  if (e) {
    e.preventDefault(); // prevent default action (page reload) taking place if Enter/Return pressed
  }
  let userNicknameElement: HTMLInputElement = <HTMLInputElement> document.getElementById('userNicknameInput');
  let userNicknameDisplay: HTMLAnchorElement = <HTMLAnchorElement> document.getElementById('user-nickname');
  let nickname: string = userNicknameElement.value;
  if (nickname.length > 0 && nickname.length < 20) {
    ipcRenderer.send('set_nickname', nickname);
    userNicknameDisplay.innerHTML = nickname;
    userNicknameElement.value = '';
  }
}

/* Add a chat bubble message to the screen */
function addMessageToView(payload: Payload, fromSelf: boolean) {
  let newRow: HTMLElement = document.createElement('div');
  newRow.className = MSG_CLASS_NAME;
  document.getElementById(BUBBLE_CLASS_NAME).appendChild(newRow);
  let newMessage: HTMLElement = document.createElement('div');
  newMessage.className = "chat-bubble ";
  if (fromSelf) { // display message depending on whether it's from our user or not
    newMessage.className += "chat-bubble__right";
  } else {
    newMessage.className += "chat-bubble__left";
  }
  newMessage.innerHTML = payload.nickname + "<span class=\"chat-name\">" + payload.message + "</span>";
  msgCount = msgCount + 1;
  document.getElementsByClassName(MSG_CLASS_NAME)[msgCount].appendChild(newMessage);
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

/* Display nickname on the top corner of the screen */
ipcRenderer.on('display_nickname', function(e: any, nickname: string) {
  let userNicknameDisplay: HTMLAnchorElement = <HTMLAnchorElement> document.getElementById('user-nickname');
  userNicknameDisplay.innerHTML = nickname;
});

/* Show online users on sidebar by dynamically creating elements based on list */
ipcRenderer.on('show_online_users', function(e: any, onlineUsers: User[], uuid: string) {
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
