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
        electron_1.ipcRenderer.send('send_broadcast', broadcastMessage);
        messageElement.value = '';
    }
}
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