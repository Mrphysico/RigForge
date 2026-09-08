import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;
let isInMemoryFallback = false;

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rigforge';

  try {
    mongoose.set('strictQuery', true);
    
    // Set a 2.5 second serverSelectionTimeoutMS so server starts immediately without hanging
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });

    isConnected = true;
    isInMemoryFallback = false;
    console.log(`✅ [MongoDB Connected] Connected to Database at ${mongoUri}`);
  } catch (error: any) {
    isConnected = false;
    isInMemoryFallback = true;
    console.warn(`⚠️ [MongoDB Offline] Could not reach ${mongoUri}.`);
    console.log('⚡ [In-Memory Storage Active] RigForge server will use resilient in-memory data store for authentication & orders.');
  }
};

export const getDbStatus = () => ({
  isConnected,
  isInMemoryFallback,
});
