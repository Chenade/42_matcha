import React from 'react';

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
    

    // get all chats

    // display all chats


    return (
        <div className="home-page">
            <h1>chats Page</h1>
            <p>Welcome to the  page</p>
        </div>
    );
}
