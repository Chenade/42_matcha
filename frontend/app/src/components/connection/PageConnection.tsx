import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../widgets/widgets';

export const PageConnection = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className="home-page">
            <div className='w-full flex flex-wrap justify-around pt-3'>
                <Button label="List" onClick={() => handleNavigation('')} />
                <Button label="Chat" onClick={() => handleNavigation('chat')} />
                <Button label="Date" onClick={() => handleNavigation('date')} />
            </div>
            <Outlet />
        </div>
    );
};
