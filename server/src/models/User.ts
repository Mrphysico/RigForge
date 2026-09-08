import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: string;
  provider: 'local' | 'google' | 'facebook';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    phone: { type: String },
    role: { type: String, default: 'customer' },
    provider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Resilient in-memory user storage fallback
export interface MemoryUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: string;
  provider: 'local' | 'google' | 'facebook';
  createdAt: string;
}

export const inMemoryUsers: MemoryUser[] = [
  {
    id: 'usr-default-arth',
    name: 'Arth Jadav',
    email: 'jadavarth07@gmail.com',
    password: '$2a$10$YourHashedPasswordPlaceholderHere',
    phone: '+91 9819319689',
    role: 'customer',
    provider: 'local',
    createdAt: new Date().toISOString(),
  },
];
