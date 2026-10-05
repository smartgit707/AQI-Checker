import express from 'express';
import { getAnalyticsDashboard, getRankings } from '../controllers/analyticsController.js';

const router = express.Router();

// GET /api/v1/analytics/dashboard
router.get('/dashboard', getAnalyticsDashboard);

// GET /api/v1/analytics/rankings
router.get('/rankings', getRankings);

export default router;
