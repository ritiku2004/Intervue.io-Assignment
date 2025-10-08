import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import app from './app.js'; // Import the configured Express app
import connectDB from './config/db.js';
import initializeSocket from './socket/socketHandler.js';

dotenv.config();

// Connect to Database
connectDB();

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
initializeSocket(io);

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));