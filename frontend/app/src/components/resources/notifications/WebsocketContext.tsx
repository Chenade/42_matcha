// WebSocketContext.tsx
import React, { createContext, useEffect, useRef } from 'react';
import { useNotification } from './NotificationContext';

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addNotification } = useNotification();
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    ws.current = new WebSocket(`ws://localhost:3000/ws/notification?token=${token}`);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server for notifications');
    };

    ws.current.onmessage = (event) => {
      console.log('Message from server:', event.data);
      addNotification('info', event.data); // Trigger a notification
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      reconnectTimer.current = setTimeout(() => connectWebSocket(), 3000);
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) ws.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={ws.current}>
      {children}
    </WebSocketContext.Provider>
  );
};
