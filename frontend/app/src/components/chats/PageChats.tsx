import React, { useState } from 'react';
import './PageChats.css';

export const PageChats = () => {
    const ws = new WebSocket('ws://localhost:3000/ws/chat/2');
    ws.onopen = () => {
        console.log('Connected to WebSocket server');
    };
    ws.onmessage = (event) => {
        console.log('Message from server:', event.data);
    };
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };


    // todo: get all channels



    // const [isNarrowView, setIsNarrowView] = useState(false);
    const [showMessages, setShowMessages] = useState(false);

    const handleChannelClick = () => {
        if (window.innerWidth <= 768) {
            setShowMessages(true);
        }
        // todo: display messages for the selected channel

    };

    const handleBackToList = () => {
        setShowMessages(false);
    };

    const showConnections = () => {
        window.location.href = '/connections';
    }

    const searchChats = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase();
    
        document.querySelectorAll(".chat-list-item").forEach((item) => {
            const name = (item as HTMLElement)
                .querySelector(".chat-item__name")
                ?.textContent?.toLowerCase();
    
            if (name?.includes(searchValue)) {
                // Show the chat list item if it matches
                (item as HTMLElement).style.display = "flex";
            } else {
                // Hide the chat list item if it does not match
                (item as HTMLElement).style.display = "none";
            }
        });
    };
    

    return (
        <div
            className={`chat-page ${window.innerWidth <= 768
                    ? showMessages
                        ? "show-messages"
                        : "narrow"
                    : ""
                }`}
        >
            <div className="chat-list">
                <div className="chat-list__search">
                    <input type="text" placeholder="Search..." onChange={searchChats} />
                </div>
                <div className="chat-list__container">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="chat-list-item" onClick={handleChannelClick}>
                            <div className="chat-item__avatar">
                                <img src="https://via.placeholder.com/90" alt="avatar" />
                            </div>
                            <div className="chat-item__content">
                                <div className="chat-item__name">User Name {i % 2 === 0 ? 'abc' : 'def'}</div>
                                <div className="chat-item__message">Last message...</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chat-list__show-all" onClick={showConnections}>
                    <button>&lt;&lt;&emsp;Show All</button>
                </div>
            </div>

            <div className="chat-content">
                
                <div className="chat-content__header">
                    {showMessages && (
                        <button onClick={handleBackToList} className="back-button">
                            &lt;&lt; Back
                        </button>
                    )}
                    <div className="chat-content__avatar">
                        <img src="https://via.placeholder.com/90" alt="avatar" />
                    </div>
                    <div className="chat-content__name">User Name</div>
                </div>
                <div className="chat-content__messages">
                    {[...Array(20)].map((_, i) => (
                        <div className={`chat-message chat-message--${i % 2 === 0 ? "right" : "left"}`}>
                            <div className="chat-message__content">
                                <div className="chat-message__text">
                                    This is a message example.
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chat-message__input">
                    <input type="text" placeholder="Type a message..." />
                    <button>Send</button>
                </div>
            </div>
        </div>
    );
}
