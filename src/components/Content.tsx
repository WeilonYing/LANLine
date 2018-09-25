import * as React from 'react';
import ChatsList from './ChatsList';
import DisplayMessages from './DisplayMessages';
import SendMessage from './SendMessage';
//import SendMessage from './components/SendMessage'

class Content extends React.Component {
    render() {
        return (
            <div className="content">
                <ChatsList />
                <DisplayMessages />
                <SendMessage />
            </div>
        );
    }
}

export default Content