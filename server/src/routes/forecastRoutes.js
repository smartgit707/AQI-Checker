import { Router } from 'express';
import { getForecast } from '../controllers/forecastController.js';

const router = Router();

router.get('/:citySlug', getForecast);

export default router;
