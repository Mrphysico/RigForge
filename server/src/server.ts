import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB, getDbStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.render.com')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: 'ONLINE',
    service: 'RigForge Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus.isConnected ? 'MongoDB Connected' : 'In-Memory Fallback Active',
    merchant: {
      beneficiary: 'Arth Rakesh Jadav',
      upiId: '9819319689@nyes',
      bank: 'Bank of India',
    },
    authSecurity: {
      inactivityTimeout: '30m',
      jwtExpiry: '30m',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// In Production (Render), serve built client static files if dist exists
const possibleDistPaths = [
  path.resolve(__dirname, '../../dist'),
  path.resolve(process.cwd(), '../dist'),
  path.resolve(process.cwd(), 'dist'),
];
const clientDist = possibleDistPaths.find((p) => fs.existsSync(p));

if (clientDist) {
  console.log(`📂 [Static Serving Active] Serving client build from: ${clientDist}`);
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🚀 RigForge Express Server running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`💳 UPI Gateway: Arth Rakesh Jadav (9819319689@nyes)`);
    console.log(`⏱️ Auto-Logout Enforced: 30 minutes of inactivity`);
    console.log('====================================================');
  });
};

startServer();

export default app;
