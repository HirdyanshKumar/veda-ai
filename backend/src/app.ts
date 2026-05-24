import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import assignmentRouter from './routes/assignment.routes';
import paperRouter from './routes/paper.routes';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/assignments', assignmentRouter);
app.use('/api/papers', paperRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

export default app;
