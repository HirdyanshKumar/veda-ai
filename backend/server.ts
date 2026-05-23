import http from 'http';
import app from './src/app';
import { connectDB } from './src/config/db';
import { initSocket } from './src/socket/socket';
import './src/workers/generation.worker';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;

const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Worker initialized and listening for jobs`);
  });
}).catch((err) => {
  console.error("Database connection failure on startup:", err);
  process.exit(1);
});
