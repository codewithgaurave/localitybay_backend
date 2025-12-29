import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';


// Import routes
import apiRoutes from './routes';

// Import admin configuration
import { adminJs, buildAdminRouter } from './admin/adminConfig';

// Import error handling
import { errorConverter, errorHandler } from './middleware/error';

// Import config
import config from './config';

const app = express();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Session middleware (must come before AdminJS)
app.use(session(config.session));

// Admin panel route (must come before body-parser middleware)
app.use(adminJs.options.rootPath, buildAdminRouter(adminJs));

// Middleware (after AdminJS setup)
app.use(helmet(config.helmet));
app.use(cors(config.cors));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Test session endpoint
app.get('/api/test-session', (req, res) => {
  res.json({ 
    session: req.session,
    hasSession: !!req.session,
    sessionID: req.sessionID
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LocalityBay API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    status: false,
    message: 'Route not found',
    errorCode: 'ROUTE_NOT_FOUND'
  });
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

export default app; 