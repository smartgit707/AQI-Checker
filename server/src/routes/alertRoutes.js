import { Router } from 'express';
import {
  getAlerts,
  addAlert,
  editAlert,
  removeAlert,
  runEvaluation
} from '../controllers/alertController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { alertRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// All alert endpoints require authentication
router.use(authenticateUser);

router.get('/', getAlerts);
router.post('/', alertRateLimiter, addAlert);
router.put('/:id', alertRateLimiter, editAlert);
router.delete('/:id', removeAlert);
router.post('/evaluate', alertRateLimiter, runEvaluation);

export default router;
