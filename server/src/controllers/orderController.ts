import { Request, Response } from 'express';
import { OrderModel, inMemoryOrders, MemoryOrder } from '../models/Order.js';
import { getDbStatus } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      items,
      subtotal,
      tax,
      shippingFee,
      totalAmount,
      utrNumber,
      receiptFileName,
    } = req.body;

    // Strict 12-digit numeric UTR validation
    const cleanUtr = typeof utrNumber === 'string' ? utrNumber.trim() : '';
    if (!/^\d{12}$/.test(cleanUtr)) {
      res.status(400).json({
        success: false,
        message: 'Invalid UPI Reference / UTR Number. Must be exactly 12 numeric digits.',
      });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot place an order with an empty cart.',
      });
      return;
    }

    const generatedOrderId = orderId || ('RF-IN-' + Math.floor(100000 + Math.random() * 900000));
    const customer = {
      name: customerName || req.user?.name || 'Arth Jadav',
      email: customerEmail || req.user?.email || 'jadavarth07@gmail.com',
    };

    const merchantDetails = {
      beneficiary: 'Arth Rakesh Jadav',
      upiId: '9819319689@nyes',
      bank: 'Bank of India',
    };

    const newOrderData: MemoryOrder = {
      orderId: generatedOrderId,
      customerName: customer.name,
      customerEmail: customer.email,
      items,
      subtotal: Number(subtotal) || 0,
      tax: Number(tax) || 0,
      shippingFee: Number(shippingFee) || 0,
      totalAmount: Number(totalAmount) || 0,
      utrNumber: cleanUtr,
      paymentMethod: 'UPI_QR',
      beneficiary: merchantDetails.beneficiary,
      upiId: merchantDetails.upiId,
      receiptFileName: receiptFileName || null,
      paymentStatus: 'pending_verification',
      createdAt: new Date().toISOString(),
    };

    const { isInMemoryFallback } = getDbStatus();

    // Persist to MongoDB if connected
    if (!isInMemoryFallback) {
      try {
        await OrderModel.create(newOrderData);
      } catch (err: any) {
        console.warn('Could not persist order to MongoDB, caching in inMemoryOrders array:', err.message);
      }
    }

    // Always keep in memory store as well
    inMemoryOrders.unshift(newOrderData);

    console.log(`📦 [New Order Logged] Docket: ${generatedOrderId} | Customer: ${customer.name} | Total: ₹${newOrderData.totalAmount} | UTR: ${cleanUtr}`);

    res.status(201).json({
      success: true,
      message: 'Order placed and payment details submitted for verification.',
      order: newOrderData,
      tracking: {
        docketNumber: generatedOrderId,
        carrier: 'BlueDart / Delhivery Surface Air',
        dispatchHub: 'Bengaluru Hub (Dispatched within 24h)',
        gstStatus: 'Input Tax Credit Eligible',
      },
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting order.',
      error: error.message,
    });
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userEmail = req.user?.email || (req.query.email as string);
    const { isInMemoryFallback } = getDbStatus();

    if (!isInMemoryFallback) {
      try {
        const query = userEmail ? { customerEmail: userEmail } : {};
        const dbOrders = await OrderModel.find(query).sort({ createdAt: -1 });
        res.json({
          success: true,
          count: dbOrders.length,
          orders: dbOrders,
        });
        return;
      } catch {
        // Fallback to memory
      }
    }

    const filtered = userEmail
      ? inMemoryOrders.filter((o) => o.customerEmail.toLowerCase() === userEmail.toLowerCase())
      : inMemoryOrders;

    res.json({
      success: true,
      count: filtered.length,
      orders: filtered,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
    });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isInMemoryFallback } = getDbStatus();

    if (!isInMemoryFallback) {
      try {
        const dbOrder = await OrderModel.findOne({ orderId: id });
        if (dbOrder) {
          res.json({ success: true, order: dbOrder });
          return;
        }
      } catch {
        // Fallback to memory
      }
    }

    const memoryMatch = inMemoryOrders.find((o) => o.orderId === id);
    if (memoryMatch) {
      res.json({ success: true, order: memoryMatch });
      return;
    }

    res.status(404).json({
      success: false,
      message: `Order #${id} not found`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message,
    });
  }
};
