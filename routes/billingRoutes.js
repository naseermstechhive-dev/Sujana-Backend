import express from 'express';
import {
  createBilling,
  getUserBillings,
  getAllBillings,
  calculateRenewal,
  deleteBilling,
  resetGoldTransactions,
  getDailyTransactions,
} from '../Controllers/billingController.js';
import { authenticateToken } from '../Middlewares/autmiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createBilling);
router.post('/calculate-renewal', authenticateToken, calculateRenewal);
router.get('/user', authenticateToken, getUserBillings);
router.get('/all', authenticateToken, getAllBillings);
router.delete('/:id', authenticateToken, deleteBilling);
router.delete('/reset-gold/admin', authenticateToken, resetGoldTransactions);
router.get('/daily-transactions', authenticateToken, getDailyTransactions);

export default router;