import express from 'express';
import * as cityController from '../controllers/cityController.js';

const router = express.Router();

router.get('/', cityController.getCities);
router.get('/:slug/dashboard', cityController.getCityDashboard);
router.get('/:slug', cityController.getCityBySlug);
router.post('/', cityController.createCity);
router.put('/:id', cityController.updateCity);
router.delete('/:id', cityController.deleteCity);

export default router;
