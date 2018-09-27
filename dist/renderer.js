"use strict";
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
var msgCount = -1;
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
/* Show online users on sidebar by dynamically creating elements based on list */
electron_1.ipcRenderer.on('show_online_users', function (e, onlineUsers, nickname) {
    // var onlineUsers1 = ["Hello","World"];
    // ipcRenderer.on('show_online_users', function(e: any) {
    document.getElementById("online-list").innerHTML = "";
    for (var i = 0; i < onlineUsers.length; i++) {
        if (onlineUsers[i].nickname === nickname) {
            // if it's yourself
            continue;
        }
        var online = document.getElementById("online-list");
        var list = document.createElement("li");
        list.className = "side-nav__item";
        var link = document.createElement("a");
        link.className = "side-nav__link";
        var innerDiv = document.createElement("div");
        innerDiv.className = "side-nav__container";
        var spanName = document.createElement("span");
        var name = document.createTextNode(onlineUsers[i].nickname);
        spanName.appendChild(name);
        innerDiv.appendChild(spanName);
        link.appendChild(innerDiv);
        link.href = "#";
        list.appendChild(link);
        online.appendChild(list);
    }
    // var online = document.getElementById("online-list");
    // var name = document.createTextNode("my title text");
    // online.appendChild(name);
    // var online = document.getElementById("user-nav__active-chat");
    // online.innerHTML = "Potato";
});
/* Handle display of broadcast message passed in from the main process */
electron_1.ipcRenderer.on('received_broadcast', function (e, payload, fromSelf) {
    let newRow = document.createElement('div');
    newRow.className = "message";
    document.getElementById('bubbles').appendChild(newRow);
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
    document.getElementsByClassName('message')[msgCount].appendChild(newMessage);
});
// Add event listeners for sending broadcast messages
const broadcast_form = document.querySelector('#send_broadcast');
const broadcast_input = document.querySelector('#broadcastMessage');
broadcast_form.addEventListener('click', send_broadcast_message);
document.querySelector('form').addEventListener('submit', send_broadcast_message, false);
//# sourceMappingURL=renderer.js.map