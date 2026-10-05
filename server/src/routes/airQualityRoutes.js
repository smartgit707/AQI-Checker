import express from 'express';
import * as airQualityController from '../controllers/airQualityController.js';

const router = express.Router();

router.get('/', airQualityController.getAirQualityList);
router.post('/', airQualityController.recordTelemetry);
router.get('/map', airQualityController.getMapAirQuality);
router.get('/:cityId/latest', airQualityController.getLatestAirQuality);
router.get('/:cityId/history', airQualityController.getAirQualityHistory);
router.get('/:cityId', airQualityController.getLatestAirQuality);

export default router;
