import React from 'react'

class ChatsList extends React.Component {
    render () {
        return (
            <nav className="sidebar">
                <ul className="side-nav">
                        <li className="side-nav__item side-nav__item--active side-nav__lobby">
                            <a href="#" className="side-nav__link">
                                <div className="side-nav__container side-nav__lobby--text"><span>Lobby <i className="fas fa-users"></i></span></div>
                            </a>
                        </li>

                        <li className="side-nav__item">
                            <a href="#" className="side-nav__link">
                                <div className="side-nav__container"><span>10.0.0.2</span></div>
                            </a>
                        </li>

                        <li className="side-nav__item side-nav__offline">
                            <a href="#" className="side-nav__link">
                                <div className="side-nav__container side-nav__offline--text"><span>Offline <i className="fas fa-angle-down"></i></span></div>
                            </a>
                        </li>
                </ul>
                <img src="img/lanline.svg" alt="LANLine logo" className="logo"></img>
            </nav>
        );
    }
}

export default ChatsList