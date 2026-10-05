import express from 'express';
import { compareCities } from '../controllers/comparisonController.js';

const router = express.Router();

// GET /api/v1/compare?cities=delhi,mumbai,chennai&period=7d
router.get('/', compareCities);

export default router;
