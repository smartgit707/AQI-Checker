import { Router } from 'express';
import {
  getOverview,
  getUsers,
  setUserStatus,
  getCities,
  setCityMonitoring,
  getDataSources,
  getSystemHealth,
  getForecasts,
  getAudit
} from '../controllers/adminController.js';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Strict Authentication and Admin Role Enforcement
router.use(authenticateUser);
router.use(requireAdmin);

router.get('/overview', getOverview);
router.get('/users', getUsers);
router.put('/users/:id/status', setUserStatus);

router.get('/cities', getCities);
router.put('/cities/:slug/status', setCityMonitoring);

router.get('/data-sources', getDataSources);
router.get('/system-health', getSystemHealth);
router.get('/forecasts', getForecasts);
router.get('/audit', getAudit);

export default router;
