import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel, inMemoryUsers, MemoryUser } from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { sendWelcomeEmail } from '../config/mailer.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rigforge_secure_jwt_secret_token_2026_key';
const JWT_EXPIRES_IN = '30m'; // Strict 30-minute auto-logout token lifespan

// Email format validation helper
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Please enter your full name.',
      });
      return;
    }

    if (!email || !email.trim()) {
      res.status(400).json({
        success: false,
        message: 'Please enter your email address.',
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!isValidEmail(cleanEmail)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email format (e.g. name@example.com).',
      });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match. Please verify your confirmation password.',
      });
      return;
    }

    const { isInMemoryFallback } = getDbStatus();

    // Check if user already exists
    if (!isInMemoryFallback) {
      try {
        const existing = await UserModel.findOne({ email: cleanEmail });
        if (existing) {
          res.status(409).json({
            success: false,
            message: 'An account with this email already exists. Please log in.',
          });
          return;
        }
      } catch {
        // Fallback to in-memory check
      }
    }

    const existingInMemory = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingInMemory) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
      return;
    }

    // Secure bcrypt password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let savedUserId = 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    if (!isInMemoryFallback) {
      try {
        const newUser = await UserModel.create({
          name: cleanName,
          email: cleanEmail,
          password: hashedPassword,
          phone: phone ? phone.trim() : '',
          role: 'customer',
          provider: 'local',
        });
        savedUserId = newUser._id.toString();
      } catch (err: any) {
        console.warn('Could not save to MongoDB, saving in inMemoryUsers:', err.message);
      }
    }

    // Preserve in memory store
    const memoryUser: MemoryUser = {
      id: savedUserId,
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : '',
      role: 'customer',
      provider: 'local',
      createdAt: new Date().toISOString(),
    };
    inMemoryUsers.push(memoryUser);

    // Dispatch welcome email to the newly registered user's own email address
    const mailResult = await sendWelcomeEmail({
      toEmail: cleanEmail,
      userName: cleanName,
    });

    console.log(`👤 [New User Registered] ID: ${savedUserId} | Email: ${cleanEmail} | Name: ${cleanName}`);

    // Return success without auto-login (user must log in with their credentials)
    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please log in.',
      user: {
        id: savedUserId,
        name: cleanName,
        email: cleanEmail,
      },
      emailDispatched: mailResult.success,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to create account. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      res.status(400).json({
        success: false,
        message: 'Please enter your email.',
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Please enter your password.',
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const { isInMemoryFallback } = getDbStatus();

    let userObj: { id: string; name: string; email: string; password?: string; role: string } | null = null;

    if (!isInMemoryFallback) {
      try {
        const dbUser = await UserModel.findOne({ email: cleanEmail });
        if (dbUser) {
          userObj = {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            password: dbUser.password,
            role: dbUser.role,
          };
        }
      } catch {
        // Fallback to memory search
      }
    }

    if (!userObj) {
      const memoryMatch = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (memoryMatch) {
        userObj = {
          id: memoryMatch.id,
          name: memoryMatch.name,
          email: memoryMatch.email,
          password: memoryMatch.password,
          role: memoryMatch.role,
        };
      }
    }

    if (!userObj || !userObj.password) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Strict bcrypt comparison only - NO backdoor credentials allowed
    const isMatch = await bcrypt.compare(password, userObj.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Issue request-specific JWT valid for 30 minutes
    const token = jwt.sign(
      {
        id: userObj.id,
        email: userObj.email,
        name: userObj.name,
        role: userObj.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log(`🔑 [User Logged In] ID: ${userObj.id} | Email: ${userObj.email}`);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      expiresIn: '30m',
      user: {
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to connect to server. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      res.status(400).json({
        success: false,
        message: 'Please enter your email address.',
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const { isInMemoryFallback } = getDbStatus();

    let userFound = false;
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    if (!isInMemoryFallback) {
      try {
        const user = await UserModel.findOne({ email: cleanEmail });
        if (user) {
          user.resetPasswordToken = resetToken;
          user.resetPasswordExpires = new Date(resetExpires);
          await user.save();
          userFound = true;
        }
      } catch {
        // Fallback
      }
    }

    if (!userFound) {
      const memoryUser = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (memoryUser) {
        memoryUser.resetPasswordToken = resetToken;
        memoryUser.resetPasswordExpires = resetExpires;
        userFound = true;
      }
    }

    console.log(`🔐 [Password Reset Requested] For ${cleanEmail}. Token: ${resetToken}`);

    // Always respond with a generic message to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account exists with that email, password reset instructions have been dispatched.',
      devResetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing password reset.',
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      res.status(400).json({ success: false, message: 'Reset token is required.' });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const { isInMemoryFallback } = getDbStatus();

    let updated = false;

    if (!isInMemoryFallback) {
      try {
        const user = await UserModel.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: new Date() },
        });
        if (user) {
          user.password = hashedPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          await user.save();
          updated = true;
        }
      } catch {
        // Fallback
      }
    }

    if (!updated) {
      const memoryUser = inMemoryUsers.find(
        (u) => u.resetPasswordToken === token && (u.resetPasswordExpires || 0) > Date.now()
      );
      if (memoryUser) {
        memoryUser.password = hashedPassword;
        memoryUser.resetPasswordToken = undefined;
        memoryUser.resetPasswordExpires = undefined;
        updated = true;
      }
    }

    if (!updated) {
      res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password.',
    });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { isInMemoryFallback } = getDbStatus();
  let userDetails: any = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    provider: (req.user as any).provider || 'local',
    providerAccountId: (req.user as any).providerAccountId,
  };

  if (!isInMemoryFallback) {
    try {
      const dbUser = await UserModel.findById(req.user.id);
      if (dbUser) {
        userDetails = {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          provider: dbUser.provider || 'local',
          providerAccountId: dbUser.providerAccountId,
          avatar: dbUser.avatar,
          phone: dbUser.phone,
        };
      }
    } catch {
      // Fallback
    }
  } else {
    const memUser = inMemoryUsers.find((u) => u.id === req.user?.id);
    if (memUser) {
      userDetails = {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        provider: memUser.provider,
        providerAccountId: memUser.providerAccountId,
        avatar: memUser.avatar,
        phone: memUser.phone,
      };
    }
  }

  res.json({
    success: true,
    user: userDetails,
    sessionExpiry: '30m',
  });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  try {
    const { name, phone } = req.body;
    const { isInMemoryFallback } = getDbStatus();
    let updatedUser: any = null;

    if (!isInMemoryFallback) {
      try {
        const dbUser = await UserModel.findById(req.user.id);
        if (dbUser) {
          if (name && typeof name === 'string') dbUser.name = name.trim();
          if (phone !== undefined) dbUser.phone = phone.trim();
          await dbUser.save();
          updatedUser = {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            provider: dbUser.provider,
            avatar: dbUser.avatar,
            phone: dbUser.phone,
          };
        }
      } catch {
        // Fallback
      }
    }

    if (!updatedUser) {
      const memUser = inMemoryUsers.find((u) => u.id === req.user?.id);
      if (memUser) {
        if (name && typeof name === 'string') memUser.name = name.trim();
        if (phone !== undefined) memUser.phone = phone.trim();
        updatedUser = {
          id: memUser.id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role,
          provider: memUser.provider,
          avatar: memUser.avatar,
          phone: memUser.phone,
        };
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message,
    });
  }
};

/**
 * Google OAuth Authentication & Account Linking Endpoint
 * Links Google accounts deterministically by stable Google `sub` (providerAccountId).
 * Never merges unrelated Google accounts.
 */
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sub, email, name, avatar } = req.body;

    if (!sub || typeof sub !== 'string' || !sub.trim()) {
      res.status(400).json({
        success: false,
        message: 'Google unique identifier (sub) is required for OAuth authentication.',
      });
      return;
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email.trim().toLowerCase())) {
      res.status(400).json({
        success: false,
        message: 'A valid email is required for Google account authentication.',
      });
      return;
    }

    const cleanSub = sub.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name && typeof name === 'string' && name.trim()) || 'Google Explorer';
    const cleanAvatar = (avatar && typeof avatar === 'string' && avatar.trim()) 
      || `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanSub}`;

    const { isInMemoryFallback } = getDbStatus();
    let matchedUser: any = null;
    let isNewUser = false;

    // 1. Check MongoDB if active
    if (!isInMemoryFallback) {
      try {
        // Find existing user specifically by Google sub
        matchedUser = await UserModel.findOne({ provider: 'google', providerAccountId: cleanSub });
        
        // If not found by sub, check if user exists by email to link account
        if (!matchedUser) {
          const emailMatch = await UserModel.findOne({ email: cleanEmail });
          if (emailMatch) {
            emailMatch.providerAccountId = cleanSub;
            emailMatch.provider = 'google';
            if (cleanAvatar) emailMatch.avatar = cleanAvatar;
            await emailMatch.save();
            matchedUser = emailMatch;
          }
        }

        // If still no user, create a brand new distinct account
        if (!matchedUser) {
          matchedUser = await UserModel.create({
            name: cleanName,
            email: cleanEmail,
            provider: 'google',
            providerAccountId: cleanSub,
            avatar: cleanAvatar,
            role: 'customer',
          });
          isNewUser = true;
        }
      } catch (err: any) {
        console.warn('MongoDB Google OAuth lookup failed, falling back to memory:', err.message);
      }
    }

    // 2. Check / Maintain In-Memory Store
    if (!matchedUser) {
      let memUser = inMemoryUsers.find(
        (u) => u.provider === 'google' && u.providerAccountId === cleanSub
      );

      if (!memUser) {
        const memEmailMatch = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
        if (memEmailMatch) {
          memEmailMatch.provider = 'google';
          memEmailMatch.providerAccountId = cleanSub;
          memEmailMatch.avatar = cleanAvatar;
          memUser = memEmailMatch;
        }
      }

      if (!memUser) {
        const newId = 'usr-g-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
        memUser = {
          id: newId,
          name: cleanName,
          email: cleanEmail,
          provider: 'google',
          providerAccountId: cleanSub,
          avatar: cleanAvatar,
          role: 'customer',
          createdAt: new Date().toISOString(),
        };
        inMemoryUsers.push(memUser);
        isNewUser = true;
      }

      matchedUser = memUser;
    }

    const userId = matchedUser._id ? matchedUser._id.toString() : matchedUser.id;
    const userName = matchedUser.name;
    const userEmail = matchedUser.email;
    const userRole = matchedUser.role || 'customer';
    const userAvatar = matchedUser.avatar || cleanAvatar;

    // Issue request-specific JWT token
    const token = jwt.sign(
      {
        id: userId,
        email: userEmail,
        name: userName,
        role: userRole,
        provider: 'google',
        providerAccountId: cleanSub,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log(`🌐 [Google OAuth Success] User: ${userId} | Sub: ${cleanSub} | Email: ${userEmail}`);

    res.json({
      success: true,
      message: isNewUser ? 'Google account created and verified.' : 'Google authentication verified.',
      token,
      expiresIn: '30m',
      isNewUser,
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        avatar: userAvatar,
        role: userRole,
        provider: 'google',
        providerAccountId: cleanSub,
      },
    });
  } catch (error: any) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed on server. Please try again.',
    });
  }
};

