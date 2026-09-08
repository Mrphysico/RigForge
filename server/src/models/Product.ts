import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  productId: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  socket?: string;
  wattage?: number;
  inStock: boolean;
  stockCount: number;
  specs: Record<string, string | number>;
  image: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    socket: { type: String },
    wattage: { type: Number },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 10 },
    specs: { type: Schema.Types.Mixed, default: {} },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
