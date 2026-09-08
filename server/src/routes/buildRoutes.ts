import { Router } from 'express';
import { 
  createBuild, 
  getBuilds, 
  getBuildById, 
  deleteBuild 
} from '../controllers/buildController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Protected build endpoints strictly tied to verified user identity
router.post('/', authenticateToken, createBuild);
router.get('/', authenticateToken, getBuilds);
router.get('/:id', authenticateToken, getBuildById);
router.delete('/:id', authenticateToken, deleteBuild);

export default router;
