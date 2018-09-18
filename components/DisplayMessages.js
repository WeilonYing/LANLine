import React from 'react'

const DUMMY_DATA = [
    {
        userID: '10.0.0.1',
        text: 'Hey, how is it going?'
    },
    {
        userID: '10.0.0.2',
        text: 'Great!'
    },
    {
        userID: '10.0.0.3',
        text: 'I\'m well thanks!'
    }
]

class DisplayMessages extends React.Component {
    render() {
        return (
            <div class="chat-window">
                <div class="chat-bubble chat-bubble__left">
                    <p>Hello! This is message 1.<span class="chat-name">10.0.0.2</span></p>
                </div>

                <div class="chat-bubble chat-bubble__right">
                    <p>Hello! This is message 2.</p>
                </div>

                <div class="chat-input">
                    <form class="form-group">
                        <label class="sr-only">Message</label>
                        <input type="text" class="form-control mb-2 mr-sm-2 mb-sm-0 input input__chat" placeholder="Message"></input>                                   
                        <button type="submit" class="chat-input__submit"><i class="fas fa-paper-plane"></i></button>
                    </form>
                </div>
            </div>
        );
    }
}

export default DisplayMessages