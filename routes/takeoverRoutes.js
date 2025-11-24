import express from 'express';
import {
  createTakeover,
  getUserTakeovers,
  getAllTakeovers,
  calculateTakeoverValue,
} from '../Controllers/takeoverController.js';
import { authenticateToken } from '../Middlewares/autmiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createTakeover);
router.get('/user', authenticateToken, getUserTakeovers);
router.get('/all', authenticateToken, getAllTakeovers);
router.post('/calculate-value', authenticateToken, calculateTakeoverValue);

export default router;