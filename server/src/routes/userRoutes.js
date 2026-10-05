import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
  getFavorites,
  addFavorite,
  removeFavorite,
  getRecent,
  recordRecent,
  getDashboard
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

// All user routes require authentication
router.use(authenticateUser);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.delete('/account', deleteAccount);

router.get('/dashboard', getDashboard);

router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.post('/favorites/:slug', addFavorite);
router.delete('/favorites/:slug', removeFavorite);

router.get('/recent', getRecent);
router.post('/recent', recordRecent);

export default router;
