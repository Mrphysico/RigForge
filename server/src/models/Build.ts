import mongoose, { Schema, Document } from 'mongoose';

export interface IBuild extends Document {
  buildId: string;
  userId: string;
  name: string;
  slots: Record<string, any>;
  totalPrice: number;
  estimatedWattage: number;
  isPublic?: boolean;
  createdAt: Date;
}

const BuildSchema = new Schema<IBuild>(
  {
    buildId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, default: 'Custom Battle Rig' },
    slots: { type: Schema.Types.Mixed, required: true },
    totalPrice: { type: Number, required: true, default: 0 },
    estimatedWattage: { type: Number, required: true, default: 0 },
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const BuildModel = mongoose.models.Build || mongoose.model<IBuild>('Build', BuildSchema);

export interface MemoryBuild {
  buildId: string;
  userId: string;
  name: string;
  slots: Record<string, any>;
  totalPrice: number;
  estimatedWattage: number;
  isPublic?: boolean;
  createdAt: string;
}

export const inMemoryBuilds: MemoryBuild[] = [];
