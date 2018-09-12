// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { ipcRenderer } from 'electron';

function start_scan(): void {
  console.log("scanning");
  document.getElementById('potato').innerHTML = "potato";
  ipcRenderer.send('start_scan');
}

const scan_btn: HTMLElement = document.querySelector('#btn_scan')
scan_btn.addEventListener('click', start_scan);
