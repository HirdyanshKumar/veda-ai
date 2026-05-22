import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import assignmentRouter from './routes/assignment.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/assignments', assignmentRouter);

// 404 Unmatched Route Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

export default app;
