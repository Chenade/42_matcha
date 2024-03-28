
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from './components/PagePlaceholder';
import { PageLogin } from './components/login/PageLogin';
import { PageNavigation } from './components/navigation/PageNavigation';

const router = createBrowserRouter([
    {
        path: '/',
        element: <PageNavigation />,
        id: 'root',
        children: [
            {
                path: '/page1',
                index: true,
                element: <HomePage test={1} />,
            },
            {
                path: '/page2',
                index: true,
                element: <HomePage test={2} />,
            },
            {
                path: '/page3',
                index: true,
                element: <HomePage test={3} />,
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