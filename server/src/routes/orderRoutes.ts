import { Router } from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Order creation: attaches user if token provided, otherwise supports guest with provided contact
router.post('/', (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    authenticateToken(req as any, res, next);
  } else {
    next();
  }
}, createOrder);

// Protected order history & single order query - strictly requires verified user authentication
router.get('/', authenticateToken, getOrders);
router.get('/:id', authenticateToken, getOrderById);

export default router;
