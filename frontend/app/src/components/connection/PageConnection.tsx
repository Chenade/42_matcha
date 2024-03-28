import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const PageConnection = () => {
    return (
        <div className="home-page">
            <h1>My Connections</h1>
            <p>Welcome to the  page</p>
            <Link to=''>list</Link>
            <Link to='chat'>chat</Link>
            <Link to='date'>date</Link>
            <Outlet />
        </div>
    );
}