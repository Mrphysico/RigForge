import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
    return;
  }

  const secret = process.env.JWT_SECRET || 'rigforge_secure_jwt_secret_token_2026_key';

  try {
    const decoded = jwt.verify(token, secret) as {
      id: string;
      email: string;
      name: string;
      role: string;
      iat: number;
      exp: number;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expired (30-minute session duration elapsed). Please sign in again.',
        code: 'TOKEN_EXPIRED',
        expired: true,
      });
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Invalid or corrupted token.',
      code: 'INVALID_TOKEN',
    });
  }
};
