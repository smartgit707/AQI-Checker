import { Router } from 'express';
import {
  getAlerts,
  addAlert,
  editAlert,
  removeAlert,
  runEvaluation
} from '../controllers/alertController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

// All alert endpoints require authentication
router.use(authenticateUser);

router.get('/', getAlerts);
router.post('/', addAlert);
router.put('/:id', editAlert);
router.delete('/:id', removeAlert);
router.post('/evaluate', runEvaluation);

export default router;
