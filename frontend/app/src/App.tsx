
// App.tsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './route';

const App: React.FC = () => {
    localStorage.setItem('token', '2');
    return (
        <RouterProvider router={router} />
    );
};

export default App;
