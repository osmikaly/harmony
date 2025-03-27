import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { parse } from 'url';

interface WebSocketClient extends WebSocket {
  isAlive: boolean;
}

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });

  // Store all connected clients
  const clients = new Set<WebSocketClient>();

  // Heartbeat to keep connections alive
  const heartbeat = () => {
    wss.clients.forEach((client: WebSocketClient) => {
      if (!client.isAlive) {
        client.terminate();
        return;
      }
      client.isAlive = false;
      client.ping();
    });
  };

  const interval = setInterval(heartbeat, 30000);

  wss.on('connection', (ws: WebSocketClient, req) => {
    const { query } = parse(req.url || '', true);
    
    // Set up heartbeat
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Add client to connected clients
    clients.add(ws);

    // Handle incoming messages
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Broadcast the message to all other clients
        clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Clean up interval on server shutdown
  wss.on('close', () => {
    clearInterval(interval);
  });

  return wss;
} 