import express from 'express';
import {
  getGoldPrices,
  updateGoldPrices,
} from '../Controllers/goldPriceController.js';
import { authenticateToken } from '../Middlewares/autmiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getGoldPrices);
router.put('/', authenticateToken, updateGoldPrices);

export default router;

