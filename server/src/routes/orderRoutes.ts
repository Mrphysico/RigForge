import { Router } from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/orderController.js';

const router = Router();

// Create new order with UPI Reference / UTR
router.post('/', createOrder);

// Retrieve all orders or filter by query (?email=...)
router.get('/', getOrders);

// Retrieve specific order
router.get('/:id', getOrderById);

export default router;
