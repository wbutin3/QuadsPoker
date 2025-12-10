import express from 'express';
import {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-checkout-session', authenticateToken, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.get('/subscription-status', authenticateToken, getSubscriptionStatus);

export default router;
