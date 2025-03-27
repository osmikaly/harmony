import express from 'express';
import cors from 'cors';
import http from 'http';
import { setupWebSocketServer } from './websocket-server';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket server
setupWebSocketServer(server);

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 