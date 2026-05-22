import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join room for selective assessment notifications
    socket.on('join', (data: { assignmentId: string }) => {
      if (data && data.assignmentId) {
        socket.join(data.assignmentId);
        console.log(`Client ${socket.id} joined room: ${data.assignmentId}`);
      }
    });

    socket.on('leave', (data: { assignmentId: string }) => {
      if (data && data.assignmentId) {
        socket.leave(data.assignmentId);
        console.log(`Client ${socket.id} left room: ${data.assignmentId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
export default initSocket;
