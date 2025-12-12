import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authroutes.js';
import cashRoutes from './routes/cashRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import renewalRoutes from './routes/renewalRoutes.js';
import takeoverRoutes from './routes/takeoverRoutes.js';
import goldPriceRoutes from './routes/goldPriceRoutes.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

// Middlewares
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://sujana-gold.vercel.app',
      'https://sujana-backend-ruh8.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

// DB Connection Middleware (for serverless environments)
app.use(async (req, res, next) => {
  // Ensure DB is connected for every request (critical for serverless)
  if (process.env.VERCEL) {
    try {
      await connectDB();
    } catch (error) {
      console.error('Database connection failed in middleware:', error);
    }
  }
  next();
});

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
app.use('/api/renewal', renewalRoutes);
app.use('/api/takeover', takeoverRoutes);
app.use('/api/gold-prices', goldPriceRoutes);

// Global Error Handler (must be last)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

// Only start the server if not running on Vercel
if (!process.env.VERCEL) {
  async function startServer() {
    try {
      await connectDB();
      app.listen(PORT, () => {
        const fullURL = `http://localhost:${PORT}`;
        console.log(`🚀 Server running on ${fullURL}`);
      });
    } catch (error) {
      console.error('[Server] Failed to start:', error);
      process.exit(1);
    }
  }
  startServer();
} else {
  // For Vercel, ensure DB is connected
  connectDB().catch(err => console.error('Vercel DB Connection Error:', err));
}

// Export for Vercel serverless
export default app;

