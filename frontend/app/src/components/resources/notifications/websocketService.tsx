// websocketService.ts
class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
  
    connect(onMessage: (data: string) => void) {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      this.ws = new WebSocket(`ws://localhost:3000/ws/notification?token=${token}`);
  
      this.ws.onopen = () => {
        console.log('Connected to WebSocket server for notifications');
      };
  
      this.ws.onmessage = (event) => {
        console.log('Message from server:', event.data);
        onMessage(event.data); // Notify application
      };
  
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.reconnectTimer = setTimeout(() => this.connect(onMessage), 30000);
      };
    }
  
    close() {
      if (this.ws) this.ws.close();
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    }
  }
  
  export const websocketService = new WebSocketService();
  