
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/homepage';
import PageLogin from './pages/loginpage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage pageTitle="首頁" />,
        id: 'root',
        children: [
            {
                index: true,
                element: <HomePage pageTitle="首頁" />,
            },
        ],
    },
    {
        path: '/login',
        element: <PageLogin />,
        id: 'login',
    },
]);

export default router;