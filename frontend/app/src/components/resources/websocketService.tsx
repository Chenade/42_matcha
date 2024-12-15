class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
  
    connect(url: string, onMessage: (data: string) => void) {
      const token = 6; // localStorage.getItem('token');
      if (!token) return;
  
      this.ws = new WebSocket(`${url}?token=${token}`);
  
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
        this.reconnectTimer = setTimeout(() => this.connect(url, onMessage), 30000);
      };
    }
  
    close() {
      if (this.ws) this.ws.close();
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    }
  }
  
  export const websocketService = new WebSocketService();
  