"use strict";
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
exports.__esModule = true;
var electron_1 = require("electron");
function get_broadcast_message() {
    var broadcastMessage = document.getElementById('broadcastMessage').value;
    electron_1.ipcRenderer.send('broadcast_message', broadcastMessage);
}
var broadcast_form = document.querySelector('#send_broadcast');
broadcast_form.addEventListener('click', get_broadcast_message);
//document.querySelector('form').addEventListener('submit', get_broadcast_message);
// ipcRenderer.on('displayBroadcastMessage', function(){
//   document.getElementById('potato').innerHTML = "parkjimin";
// });
//# sourceMappingURL=renderer.js.map