// homepage.tsx
import React from 'react';

const PagePlaceholder = ({test}: {test: number}) => {
    return (
        <div className="home-page">
            <h1>Home Page {test}</h1>
            <p>Welcome to the  page {test}</p>
        </div>
    );
}

export default PagePlaceholder;
