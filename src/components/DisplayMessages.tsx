import * as React from 'react';

import Message from './Message';

export default class DisplayMessages extends React.Component <{}> {
        
    render() {
            return (
                <div className="chat-window">
                    <Message />
                </div>
            );
    }
}