
// App.tsx
import { RouterProvider } from 'react-router-dom';
import router from './route';

import { NotificationProvider } from './components/resources/notifications/NotificationContext';
import NotificationOverlay from './components/resources/notifications/NotificationOverlay';

const App: React.FC = () => {
    return (
        <NotificationProvider>
            <NotificationOverlay />
            <RouterProvider router={router} />
        </NotificationProvider>
    );
};

export default App;
