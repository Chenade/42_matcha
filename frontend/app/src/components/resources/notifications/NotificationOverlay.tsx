// NotificationOverlay.tsx
import React from 'react';
import { useNotification } from './NotificationContext';
import './NotificationOverlay.css';

const NotificationOverlay: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-overlay">
      {notifications.map(({ id, message, type }) => (
        <div key={id} className={`notification-content notification-${id} ${type}`}>
          <p>{message}</p>
          <button className='notification-close' onClick={() => removeNotification(id)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationOverlay;
