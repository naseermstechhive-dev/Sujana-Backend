import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import mongoose from './config/db.js';
import authRoutes from './routes/authroutes.js';
import cashRoutes from './routes/cashRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import renewalRoutes from './routes/renewalRoutes.js';
import takeoverRoutes from './routes/takeoverRoutes.js';
import goldPriceRoutes from './routes/goldPriceRoutes.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

// Middlewares - CORS Configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? '*' // Allow all origins in production
      : [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:3000',
          'http://localhost:5001',
        ],
    credentials: process.env.NODE_ENV !== 'production', // credentials can't be used with origin: '*'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Increase JSON body size limit to handle Base64 encoded images (photo + signature)
// Default is 100kb, we need at least 10MB for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    let dbStatus = 'disconnected';
    let dbError = null;
    
    try {
      const dbConnection = mongoose.connection;
      
      if (dbConnection.readyState === 1) {
        dbStatus = 'connected';
        // Try a simple query to verify connection
        await dbConnection.db.admin().ping();
      } else if (dbConnection.readyState === 2) {
        dbStatus = 'connecting';
      } else {
        dbStatus = 'disconnected';
      }
    } catch (error) {
      dbStatus = 'error';
      dbError = error.message;
    }

    const healthStatus = {
      success: true,
      status: dbStatus === 'connected' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      uptimeFormatted: formatUptime(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        api: {
          status: 'operational',
          message: 'API server is running'
        },
        database: {
          status: dbStatus,
          message: dbStatus === 'connected' 
            ? 'MongoDB connection is active' 
            : dbError || 'MongoDB connection issue',
          ...(dbError && { error: dbError })
        }
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB'
      }
    };

    // Return appropriate status code based on health
    const statusCode = dbStatus === 'connected' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

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

