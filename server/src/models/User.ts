import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: string;
  provider: 'local' | 'google' | 'facebook';
  providerAccountId?: string;
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    phone: { type: String, trim: true },
    role: { type: String, default: 'customer' },
    provider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
    providerAccountId: { type: String, index: true },
    avatar: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast and unique OAuth provider account resolution
UserSchema.index({ provider: 1, providerAccountId: 1 }, { sparse: true });

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Resilient in-memory user storage fallback (starts completely empty, zero hardcoded accounts)
export interface MemoryUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: string;
  provider: 'local' | 'google' | 'facebook';
  providerAccountId?: string;
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  createdAt: string;
}

export const inMemoryUsers: MemoryUser[] = [];

