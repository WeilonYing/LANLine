import * as React from 'react';

class Header extends React.Component {
    render() {
        return (
            <nav className="user-nav">
                <div className="user-nav__you">
                    10.0.0.3
                </div>

                <div className="user-nav__active-chat">
                    Lobby
                </div>
            </nav>
        )
    }
}

export default Header