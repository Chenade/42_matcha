import React, { useEffect } from 'react';
import './page-navigation.css';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const PageNavigation = () => {

    const [pageTitle, setPageTitle] = React.useState('首頁');

    useEffect(() => {
        return () => {
            const toggle = document.getElementById('header-toggle');
            if (toggle) {
                toggle.removeEventListener('click', toggleClickHandler);
            }
        };
    }, []); // Empty dependency array to run effect only once when component mounts

    // Click event handler for the toggle
    const toggleClickHandler = () => {
        const nav = document.getElementById('nav-bar');
        const bodypd = document.getElementById('body-container');
        const headerpd = document.getElementById('header-toggle');

        if (nav && headerpd && bodypd) {
            nav.classList.toggle('show-navbar');
            bodypd.classList.toggle('body-pd');
            headerpd.classList.toggle('body-pd');
        }
    };

    return (
        <>
            <header className="header" id="header" onClick={toggleClickHandler}>
                <h1 id="header-toggle" style={{ fontSize: '1.8em' }}>{pageTitle}</h1>
                <Navbar setPageTitle={setPageTitle} />
            </header>
            <div id="body-container">
                <Outlet />
            </div>
        </>
        
    );
};
