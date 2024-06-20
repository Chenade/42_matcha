import React, { useEffect } from 'react';
import './page-navigation.css';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import type { PageTitle } from './Navbar';

export const PageNavigation = () => {

    const [pageTitle, setPageTitle] = React.useState<PageTitle>('page1 Title');

    useEffect(() => {
        return () => {
            const toggle = document.getElementById('header-toggle');
            if (toggle) {
                toggle.removeEventListener('click', toggleClickHandler);
            }
        };
    }, []);

    // get cursor point 
    const toggleClickHandler = () => {
        // setCursorPosition({ x: e.clientX, y: e.clientY });

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
            <header className="header" id="header"  onClick={toggleClickHandler}>
                <h1 id="header-toggle" style={{ fontSize: '1.8em' }}>{pageTitle}</h1>
                <Navbar setPageTitle={setPageTitle} />
            </header>
            <div id="body-container">
                <Outlet />
            </div>
        </>
        
    );
};
