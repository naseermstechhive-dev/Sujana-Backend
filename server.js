import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authroutes.js';
import cashRoutes from './routes/cashRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import User from './Models/user.js';

dotenv.config();
const app = express();

// Middlewares
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174',],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

// DB
connectDB();

// Root endpoint for basic connectivity check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sujana Gold Backend API Server',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cash', cashRoutes);
app.use('/api/billing', billingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
