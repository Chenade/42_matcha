import React, { useEffect } from 'react';
import './sidebar.css';

interface NavbarProps {
    pageTitle: string;
}


const Navbar: React.FC<NavbarProps> = ({ pageTitle }) => {
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

    const logout = () => {
        localStorage.removeItem('Token');
        localStorage.removeItem('path');
        localStorage.removeItem('forceLogout');
        window.location.href = '/';
    };

    return (
        <header className="header" id="header" onClick={toggleClickHandler}>
            <h1 id="header-toggle" style={{ fontSize: '1.8em' }}>{pageTitle}</h1>
            <div className="l-navbar" id="nav-bar">
                <nav className="nav">
                    <div>
                        <a href="/" className="nav_logo">
                            <i className="bx bx-layer nav_logo-icon"></i>
                            <span className="nav_logo-name">Matcha</span>
                        </a>
                        <div className="nav_list">
                            <a id="nav_banners" className="nav_link">
                                <i className="fas fa-object-group"></i>
                                <span className="nav_name">首頁</span>
                            </a>
                            {/* Other menu items */}
                        </div>
                    </div>
                    <a className="nav_link" href="javascript:void(0)" onClick={logout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="nav_name">SignOut</span>
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
