// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { ipcRenderer } from 'electron';

function start_scan(): void {
  console.log("scanning");
  document.getElementById('potato').innerHTML = "potato";
  ipcRenderer.send('start_scan');
}

function send_broadcast_message(): void {
	var broadcastMessage = (<HTMLInputElement>document.getElementById('broadcastMessage')).value;
	ipcRenderer.send('send_broadcast', broadcastMessage);
}

ipcRenderer.on('received_broadcast', function(e: any, broadcastJSON: string) {
	document.getElementById('received').innerHTML = broadcastJSON;
});

const scan_btn: HTMLElement = document.querySelector('#btn_scan')
scan_btn.addEventListener('click', start_scan);

const broadcast_form: HTMLElement = document.querySelector('#send_broadcast')
broadcast_form.addEventListener('click', send_broadcast_message);
// document.querySelector('form').addEventListener('submit', send_broadcast_message);