"use strict";
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const BUBBLE_CLASS_NAME = 'bubbles';
const MSG_CLASS_NAME = 'message';
const LOBBY_ID_NAME = 'lobby';
var msgCount = -1;
var isChangingView = false;
/* Start sending of heartbeat messages */
function start_scan() {
    console.log("scanning");
    electron_1.ipcRenderer.send('start_scan');
}
/* Handle sending of broadcast message from the GUI to the main process */
function send_broadcast_message(e) {
    if (e) {
        e.preventDefault(); // prevent default action (page reload) taking place if Enter/Return pressed
    }
    let messageElement = document.getElementById('broadcastMessage');
    let broadcastMessage = messageElement.value;
    if (broadcastMessage.length > 0) {
        // This part is currently used to process direct messages
        // Format: enter the IP address of the user you wish to send it to
        // followed by the message
        // e.g. '10.0.0.3 Hi!' would send 'Hi!' to 10.0.0.3
        // TODO: delete this part once MVC is created
        let broadcastMessageSplit = broadcastMessage.split(' ');
        let ipAddr = broadcastMessageSplit[0];
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddr)) {
            let message = broadcastMessageSplit.slice(1, broadcastMessageSplit.length + 1);
            electron_1.ipcRenderer.send('send_private_message', ipAddr, message);
            messageElement.value = '';
            return;
        }
        // end private message section
        electron_1.ipcRenderer.send('send_broadcast', broadcastMessage);
        messageElement.value = '';
    }
}
/* Add a chat bubble message to the screen */
function addMessageToView(payload, fromSelf) {
    let newRow = document.createElement('div');
    newRow.className = MSG_CLASS_NAME;
    document.getElementById(BUBBLE_CLASS_NAME).appendChild(newRow);
    let newMessage = document.createElement('div');
    newMessage.className = "chat-bubble ";
    if (fromSelf) { // display message depending on whether it's from our user or not
        newMessage.className += "chat-bubble__right";
    }
    else {
        newMessage.className += "chat-bubble__left";
    }
    newMessage.innerHTML = payload.nickname + "<span class=\"chat-name\">" + payload.message + "</span>";
    msgCount = msgCount + 1;
    document.getElementsByClassName(MSG_CLASS_NAME)[msgCount].appendChild(newMessage);
}
/* Remove all displayed messages on the screen */
function clearMessageView() {
    // best way to clear up a view according to Stack Overflow https://stackoverflow.com/a/22966637
    let bubbleNode = document.getElementById(BUBBLE_CLASS_NAME);
    let newBubbleNode = bubbleNode.cloneNode(/* deep clone */ false);
    bubbleNode.parentNode.replaceChild(newBubbleNode, bubbleNode);
    msgCount = -1;
}
/* Show all messages sent and received from a specific user */
function setMessageView(uuid) {
    clearMessageView();
    electron_1.ipcRenderer.send('retrieve_messages', uuid);
}
/* Display messages sent and received */
electron_1.ipcRenderer.on('show_messages', function (e, messages, ownUuid) {
    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        addMessageToView(message, message.uuid === ownUuid);
    }
    console.log("message passed back to renderer process!"); // DEBUG
});
/* Show online users on sidebar by dynamically creating elements based on list */
electron_1.ipcRenderer.on('show_online_users', function (e, onlineUsers, uuid) {
    document.getElementById("own-nickname").innerHTML = uuid;
    // Every time this function is called, clear the div and regenerate everything
    // inside it.
    document.getElementById("online-list").innerHTML = "";
    for (let i = 0; i < onlineUsers.length; i++) {
        if (onlineUsers[i].uuid === uuid) {
            // if it's yourself, don't display
            continue;
        }
        let online = document.getElementById("online-list");
        let list = document.createElement("li");
        list.className = "side-nav__item";
        let link = document.createElement("a");
        link.className = "side-nav__link";
        let innerDiv = document.createElement("div");
        innerDiv.className = "side-nav__container";
        let spanName = document.createElement("span");
        let name = document.createTextNode(onlineUsers[i].nickname);
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
electron_1.ipcRenderer.on('show_offline_users', function (e, offlineUsers) {
    // Every time this function is called, clear the div and regenerate everything
    // inside it.
    document.getElementById("offline-list").innerHTML = "";
    for (var i = 0; i < offlineUsers.length; i++) {
        let offline = document.getElementById("offline-list");
        let list = document.createElement("li");
        list.className = "side-nav__container side-nav__offline--item";
        let link = document.createElement("a");
        link.className = "side-nav__link";
        link.href = "#"; // this should eventually link to the correct tab
        let name = document.createTextNode(offlineUsers[i].nickname);
        list.appendChild(name);
        link.appendChild(list);
        offline.appendChild(link);
    }
});
/* Handle display of broadcast message passed in from the main process */
electron_1.ipcRenderer.on('received_broadcast', function (e, payload, fromSelf) {
    addMessageToView(payload, fromSelf);
});
// Add event listeners for sending broadcast messages
const broadcast_form = document.querySelector('#send_broadcast');
const broadcast_input = document.querySelector('#broadcastMessage');
broadcast_form.addEventListener('click', send_broadcast_message);
document.querySelector('form').addEventListener('submit', send_broadcast_message, false);
// Add event listener for lobby navigation button on the sidebar
const lobby_button = document.querySelector('#' + LOBBY_ID_NAME);
// TODO: add a special method for setting message views for lobby chat
lobby_button.addEventListener('click', () => { setMessageView(/* uuid */ 'lobby'); });
//# sourceMappingURL=renderer.js.map