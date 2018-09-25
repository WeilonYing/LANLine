import * as React from 'react';
import { ipcRenderer } from 'electron';

import { UIManager } from './../UIManager';

export default class Message extends React.Component <{}, {isMyNickname: boolean}> {

    uiManager: UIManager;

    constructor(props:any) {
        super(props);
        this.handleMyNickname = this.handleMyNickname.bind(this);
        this.handleNickname = this.handleNickname.bind(this);
        this.state = {isMyNickname: false};
        this.getBroadcastJSON = this.handleNickname.bind(this);
        ipcRenderer.on('received_broadcast', this.getBroadcastJSON);
    }

    getBroadcastJSON(e: any, broadcastJSON: string) {
        var bcJSON = JSON.parse(broadcastJSON);
        if (this.uiManager.getMyNickname === bcJSON.nickname) {
            this.handleMyNickname;
        } else {
            this.handleNickname;
        }
    }

    handleMyNickname() {
        this.setState({isMyNickname: true});
    }

    handleNickname() {
        this.setState({isMyNickname: false});
    }


        
    render() {
        const isMyNickname = this.state.isMyNickname;
        this.getBroadcastJSON;

        if (!isMyNickname) {
            console.log(this.uiManager.getMyNickname);
            return (
            <div className="chat-bubble chat-bubble__left">
                <p>Hello! This is message 1.<span className="chat-name">10.0.0.2</span></p>
            </div>
            );
        } else {
            console.log("lol what");
            return (
            <div className="chat-bubble chat-bubble__right">
                <p>Hello! This is message 2.</p>
            </div>
            );
        }
    }
}