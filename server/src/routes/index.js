import express from 'express';
import cityRoutes from './cityRoutes.js';
import airQualityRoutes from './airQualityRoutes.js';
import dataSourceRoutes from './dataSourceRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import compareRoutes from './compareRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import { getDBStatus } from '../config/db.js';
import { successResponse } from '../utils/response.js';

export function configureRoutes(app) {
  // Root & Public Health Status Endpoints
  const healthPayload = () => ({
    service: 'AeroSense Environmental Intelligence API',
    status: 'healthy',
    version: 'v1',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: getDBStatus()
  });

  app.get('/', (req, res) => {
    return successResponse(res, healthPayload());
  });

  app.get('/api/health', (req, res) => {
    return successResponse(res, healthPayload());
  });

  // Version 1 API Routes
  const apiV1 = express.Router();
  apiV1.use('/auth', authRoutes);
  apiV1.use('/users', userRoutes);
  apiV1.use('/cities', cityRoutes);
  apiV1.use('/air-quality', airQualityRoutes);
  apiV1.use('/data-sources', dataSourceRoutes);
  apiV1.use('/analytics', analyticsRoutes);
  apiV1.use('/compare', compareRoutes);

  app.use('/api/v1', apiV1);
}
