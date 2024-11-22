
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PageLogin } from './components/login/PageLogin';
import { PageNavigation } from './components/navigation/PageNavigation';
import { PageExplorer } from './components/browse/PageExplorer';
import { PageConnection } from './components/connection/PageConnection';
import { PageMyProfile } from './components/profile/PageMyProfile';
import { PageMyDates } from './components/dates/PageMyDates';
import { PageChats } from './components/chats/PageChats';
import { PageRegistration } from './components/login/PageRegistration';
import { PageForgotPassword } from './components/login/PageForgotPassword';
import { PageResetPassword } from './components/login/PageResetPassword';

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
                path: '/connections',
                element: <PageConnection />,
            },
            {
                path: '/me',
                element: <PageMyProfile />,
            },
            {
                path: '/dates',
                element: <PageMyDates />,
            },
            {
                path: '/chats',
                element: <PageChats />,
            },
        ],
    },
    {
        path: '/login',
        element: <PageLogin />,
        id: 'login',
    },
    {
        path: 'register',
        element: <PageRegistration />,
        id: 'register',
    },
    {
        path: 'forgot-password',
        element: <PageForgotPassword />,
        id: 'forgot-password',
    },
    {
        path: 'reset-password',
        element: <PageResetPassword />,
        id: 'reset-password',
    }
]);

export default router;