import express from 'express';
import {
  createRenewal,
  getUserRenewals,
  getAllRenewals,
  calculateRenewalCommission,
} from '../Controllers/renewalController.js';
import { authenticateToken } from '../Middlewares/autmiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createRenewal);
router.get('/user', authenticateToken, getUserRenewals);
router.get('/all', authenticateToken, getAllRenewals);
router.post('/calculate-commission', authenticateToken, calculateRenewalCommission);

export default router;