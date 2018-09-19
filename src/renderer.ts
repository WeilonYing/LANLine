// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { ipcRenderer } from 'electron';

function get_broadcast_message(): void {
	var broadcastMessage = (<HTMLInputElement>document.getElementById('broadcastMessage')).value;
	ipcRenderer.send('broadcast_message', broadcastMessage);
}

const broadcast_form: HTMLElement = document.querySelector('#send_broadcast')
broadcast_form.addEventListener('click', get_broadcast_message);
//document.querySelector('form').addEventListener('submit', get_broadcast_message);

// ipcRenderer.on('displayBroadcastMessage', function(){
//   document.getElementById('potato').innerHTML = "parkjimin";
// });