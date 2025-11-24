import express from 'express';
import {
  addCash,
  getCashVault,
  addRemainingCash,
} from '../Controllers/cashController.js';
import { authenticateToken } from '../Middlewares/autmiddleware.js';

const router = express.Router();

router.post('/add', authenticateToken, addCash);
router.post('/remaining', authenticateToken, addRemainingCash);
router.get('/', authenticateToken, getCashVault);

export default router;
