import React from 'react'
import ChatsList from './components/ChatsList'
import DisplayMessages from './components/DisplayMessages'
//import SendMessage from './components/SendMessage'

class Content extends React.Component {
    render() {
        return (
            <div className="content">
                <ChatsList />
                <DisplayMessages />
            </div>
        );
    }
}

export default Content