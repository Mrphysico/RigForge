import { Response } from 'express';
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

    // Determine customer identity - never fallback to hardcoded mock names
    const authenticatedUser = req.user;
    const finalCustomerName = (customerName && typeof customerName === 'string' && customerName.trim()) 
      || authenticatedUser?.name;
    const finalCustomerEmail = (customerEmail && typeof customerEmail === 'string' && customerEmail.trim().toLowerCase()) 
      || authenticatedUser?.email;

    if (!finalCustomerName || !finalCustomerEmail) {
      res.status(400).json({
        success: false,
        message: 'Customer name and valid email address are required to place an order.',
      });
      return;
    }

    const userId = authenticatedUser?.id || `guest-${Date.now()}`;
    const generatedOrderId = orderId || ('RF-IN-' + Math.floor(100000 + Math.random() * 900000));

    const merchantDetails = {
      beneficiary: 'Arth Rakesh Jadav',
      upiId: '9819319689@nyes',
      bank: 'Bank of India',
    };

    const newOrderData: MemoryOrder = {
      orderId: generatedOrderId,
      userId,
      customerName: finalCustomerName,
      customerEmail: finalCustomerEmail,
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

    console.log(`📦 [Order Created] Docket: ${generatedOrderId} | User: ${userId} (${finalCustomerEmail}) | Total: ₹${newOrderData.totalAmount}`);

    res.status(201).json({
      success: true,
      message: 'Order placed and payment details submitted for verification.',
      orderId: generatedOrderId,
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
    // Strictly require authenticated user identity from verified JWT
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required to access order history.',
      });
      return;
    }

    const userId = req.user.id;
    const userEmail = req.user.email.toLowerCase();
    const { isInMemoryFallback } = getDbStatus();

    if (!isInMemoryFallback) {
      try {
        const dbOrders = await OrderModel.find({
          $or: [{ userId: userId }, { customerEmail: userEmail }],
        }).sort({ createdAt: -1 });

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

    // Isolated in-memory orders filtered strictly for this authenticated user
    const filtered = inMemoryOrders.filter(
      (o) => o.userId === userId || o.customerEmail.toLowerCase() === userEmail
    );

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

export const getOrderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    const { id } = req.params;
    const userId = req.user.id;
    const userEmail = req.user.email.toLowerCase();
    const { isInMemoryFallback } = getDbStatus();

    let foundOrder: any = null;

    if (!isInMemoryFallback) {
      try {
        foundOrder = await OrderModel.findOne({ orderId: id });
      } catch {
        // Fallback to memory
      }
    }

    if (!foundOrder) {
      foundOrder = inMemoryOrders.find((o) => o.orderId === id);
    }

    if (!foundOrder) {
      res.status(404).json({
        success: false,
        message: `Order #${id} not found`,
      });
      return;
    }

    // Prevent IDOR - Strictly check that the requested order belongs to THIS user
    const orderUserId = foundOrder.userId;
    const orderEmail = (foundOrder.customerEmail || '').toLowerCase();

    if (orderUserId !== userId && orderEmail !== userEmail) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this order.',
      });
      return;
    }

    res.json({ success: true, order: foundOrder });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message,
    });
  }
};
