"use strict";
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
exports.__esModule = true;

import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header';
import Content from './components/Content';

ReactDOM.render(<Header />, document.getElementById('header'));
ReactDOM.render(<Content />, document.getElementById('content'));

var electron_1 = require("electron");
function start_scan() {
    console.log("scanning");
    document.getElementById('potato').innerHTML = "potato";
    electron_1.ipcRenderer.send('start_scan');
}
var scan_btn = document.querySelector('#btn_scan');
scan_btn.addEventListener('click', start_scan);
//# sourceMappingURL=renderer.js.map

