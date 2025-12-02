import express from 'express';
import {
  addCash,
  getCashVault,
  addRemainingCash,
  addBillingDeduction,
  resetInitialCash,
  getMargin,
  checkInitialCashExists,
  resetAllCash,
} from '../Controllers/cashController.js';
import { authenticateToken } from '../Middlewares/autmiddleware.js';

const router = express.Router();

router.post('/add', authenticateToken, addCash);
router.post('/remaining', authenticateToken, addRemainingCash);
router.post('/billing-deduction', authenticateToken, addBillingDeduction);
router.delete('/reset-initial', authenticateToken, resetInitialCash);
router.delete('/reset-all', authenticateToken, resetAllCash);
router.get('/margin', authenticateToken, getMargin);
router.get('/check-initial', authenticateToken, checkInitialCashExists);
router.get('/', authenticateToken, getCashVault);

export default router;
