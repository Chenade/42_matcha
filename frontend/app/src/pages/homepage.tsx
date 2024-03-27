// homepage.tsx
import React from 'react';
import Navbar from '../components/sidebar/sidebar';

const HomePage: React.FC<{ pageTitle: string }> = ({ pageTitle }) => {
    return (
        <>
            <Navbar pageTitle={pageTitle} />
            <div id="body-container">
                <div className="home-page">
                    <h1>Home Page</h1>
                    <p>Welcome to the home page</p>
                </div>
            </div>
        </>
    );
}

export default HomePage;
