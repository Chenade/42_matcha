
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PageLogin } from './components/login/PageLogin';
import { PageNavigation } from './components/navigation/PageNavigation';
import { PageExplorer } from './components/browse/PageExplorer';
import { PageConnection } from './components/connection/PageConnection';
import { PageMyProfile } from './components/profile/PageMyProfile';
import { PageChat } from './components/connection/chat/PageChat';
import { PageDate } from './components/connection/date/PageDate';
import { PageList } from './components/connection/list/PageList';

const router = createBrowserRouter([
    {
        path: '/',
        element: <PageNavigation />,
        id: 'root',
        
        children: [
            {
                index: true,
                element: <Navigate to='/explorer' />,
            },
            {
                path: '/explorer',
                element: <PageExplorer />,
            },
            {
                path: '/connection',
                element: <PageConnection />,
                children: [
                    {
                        index: true,
                        element: <PageList/>,
                    },
                    {
                        path: '/connection/chat',
                        element: <PageChat />,
                    },
                    {
                        path: '/connection/date',
                        element: <PageDate />,
                    },
                ]
            },
            {
                path: '/me',
                element: <PageMyProfile />,
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