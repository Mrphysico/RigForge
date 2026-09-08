import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  forgotPassword, 
  resetPassword,
  googleAuth 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;

