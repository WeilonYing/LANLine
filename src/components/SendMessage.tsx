import * as React from 'react';
import { ipcRenderer } from 'electron';

import Message from './Message';

export default class SendMessage extends React.Component <{}, { value: string }> {

    msg: Message;

    constructor(props:any) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event: any) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event: any) {
      ipcRenderer.send('send_broadcast', this.state.value);
      alert('A name was submitted: ' + this.state.value);
      this.msg.getBroadcastJSON;
      event.preventDefault();
    }
  
    render() {
      return (
        <div className="chat-input">
            <form className="form-group" id="broadcastForm" onSubmit={this.handleSubmit}>
                <label className="sr-only">Message</label>
                <input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0 input input__chat" placeholder="Message" id="broadcastMessage" value={this.state.value} onChange={this.handleChange} ></input>
                                        
                <button type="button" className="chat-input__submit" id="send_broadcast" onClick={this.handleSubmit}><i className="fas fa-paper-plane"></i></button>
            </form>
        </div>
      );
    }
  }