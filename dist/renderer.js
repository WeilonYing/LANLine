"use strict";
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
exports.__esModule = true;
var electron_1 = require("electron");
function start_scan() {
    console.log("scanning");
    document.getElementById('potato').innerHTML = "potato";
    electron_1.ipcRenderer.send('start_scan');
}
function send_broadcast_message() {
    var broadcastMessage = document.getElementById('broadcastMessage').value;
    electron_1.ipcRenderer.send('send_broadcast', broadcastMessage);
}
electron_1.ipcRenderer.on('received_broadcast', function (e, broadcastJSON) {
    var bc = JSON.parse(broadcastJSON);
    document.getElementById('received').innerHTML = bc.message;
});
// const scan_btn: HTMLElement = document.querySelector('#btn_scan')
// scan_btn.addEventListener('click', start_scan);
var broadcast_form = document.querySelector('#send_broadcast');
broadcast_form.addEventListener('click', send_broadcast_message);
document.querySelector('form').addEventListener('submit', send_broadcast_message);
//# sourceMappingURL=renderer.js.map