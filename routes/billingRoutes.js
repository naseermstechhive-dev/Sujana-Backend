import express from 'express';
import {
  createBilling,
  getUserBillings,
  getAllBillings,
  calculateRenewal,
  deleteBilling,
} from '../Controllers/billingController.js';
import { authenticateToken } from '../Middlewares/autmiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createBilling);
router.post('/calculate-renewal', authenticateToken, calculateRenewal);
router.get('/user', authenticateToken, getUserBillings);
router.get('/all', authenticateToken, getAllBillings);
router.delete('/:id', authenticateToken, deleteBilling);

export default router;