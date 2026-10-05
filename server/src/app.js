import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { configureRoutes } from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { sanitizeInput } from './middleware/sanitizeInput.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

// Security HTTP headers with proper policies for Leaflet and images
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https:", "http:"],
        imgSrc: ["'self'", "data:", "blob:", "https:", "http:", "*"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        objectSrc: ["'none'"]
      }
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false
  })
);

// Cross-Origin Resource Sharing
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // In production, allow same-origin, Vercel deployments, and configured client URLs
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/serverless
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Request body parsers with reasonable size limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// NoSQL Query Injection Sanitizer
app.use(sanitizeInput);

// General API Rate Limiting
app.use('/api', apiRateLimiter);

// Development request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Mount application API routes
configureRoutes(app);

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
