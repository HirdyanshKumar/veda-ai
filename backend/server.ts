import http from 'http';
import app from './src/app';
import { connectDB } from './src/config/db';
import { initSocket } from './src/socket/socket';
// Simply importing the worker initializes it and starts listening to queues
import './src/workers/generation.worker';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Sockets prior to starting listener
initSocket(httpServer);

// Connect to Database and start listening
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Worker initialized and listening for jobs`);
  });
}).catch((err) => {
  console.error("Database connection failure on startup:", err);
  process.exit(1);
});
