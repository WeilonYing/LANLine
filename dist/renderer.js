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
var scan_btn = document.querySelector('#btn_scan');
scan_btn.addEventListener('click', start_scan);
//# sourceMappingURL=renderer.js.map