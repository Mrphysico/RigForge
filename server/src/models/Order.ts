import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  utrNumber: string;
  paymentMethod: string;
  beneficiary: string;
  upiId: string;
  receiptFileName?: string;
  paymentStatus: 'pending_verification' | 'verified' | 'failed';
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    utrNumber: { type: String, required: true, match: /^\d{12}$/ },
    paymentMethod: { type: String, default: 'UPI_QR' },
    beneficiary: { type: String, default: 'Arth Rakesh Jadav' },
    upiId: { type: String, default: '9819319689@nyes' },
    receiptFileName: { type: String },
    paymentStatus: {
      type: String,
      enum: ['pending_verification', 'verified', 'failed'],
      default: 'pending_verification',
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

// Resilient in-memory orders store
export interface MemoryOrder {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  utrNumber: string;
  paymentMethod: string;
  beneficiary: string;
  upiId: string;
  receiptFileName?: string | null;
  paymentStatus: 'pending_verification' | 'verified' | 'failed';
  createdAt: string;
}

export const inMemoryOrders: MemoryOrder[] = [];
