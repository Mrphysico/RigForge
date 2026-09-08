import { Response } from 'express';
import { BuildModel, inMemoryBuilds, MemoryBuild } from '../models/Build.js';
import { getDbStatus } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const createBuild = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required to save builds.' });
      return;
    }

    const { name, slots, totalPrice, estimatedWattage, isPublic } = req.body;

    if (!slots || typeof slots !== 'object' || Object.keys(slots).length === 0) {
      res.status(400).json({ success: false, message: 'Cannot save an empty PC configuration.' });
      return;
    }

    const userId = req.user.id;
    const buildId = 'BLD-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const buildData: MemoryBuild = {
      buildId,
      userId,
      name: (name && typeof name === 'string' && name.trim()) || 'Custom Battle Rig',
      slots,
      totalPrice: Number(totalPrice) || 0,
      estimatedWattage: Number(estimatedWattage) || 0,
      isPublic: !!isPublic,
      createdAt: new Date().toISOString(),
    };

    const { isInMemoryFallback } = getDbStatus();

    if (!isInMemoryFallback) {
      try {
        await BuildModel.create(buildData);
      } catch (err: any) {
        console.warn('MongoDB build save failed, cached in memory:', err.message);
      }
    }

    inMemoryBuilds.unshift(buildData);

    console.log(`🛠️ [Build Saved] ID: ${buildId} | User: ${userId} | Name: "${buildData.name}"`);

    res.status(201).json({
      success: true,
      message: 'Build saved to your personal library.',
      build: buildData,
    });
  } catch (error: any) {
    console.error('Error saving build:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save build.',
      error: error.message,
    });
  }
};

export const getBuilds = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const userId = req.user.id;
    const { isInMemoryFallback } = getDbStatus();

    let userBuilds: any[] = [];

    if (!isInMemoryFallback) {
      try {
        userBuilds = await BuildModel.find({ userId }).sort({ createdAt: -1 });
      } catch {
        // Fallback to memory
      }
    }

    if (userBuilds.length === 0) {
      userBuilds = inMemoryBuilds.filter((b) => b.userId === userId);
    }

    res.json({
      success: true,
      count: userBuilds.length,
      builds: userBuilds,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve builds.',
      error: error.message,
    });
  }
};

export const getBuildById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const userId = req.user.id;
    const { isInMemoryFallback } = getDbStatus();

    let foundBuild: any = null;

    if (!isInMemoryFallback) {
      try {
        foundBuild = await BuildModel.findOne({
          $or: [{ buildId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
        });
      } catch {
        // Fallback
      }
    }

    if (!foundBuild) {
      foundBuild = inMemoryBuilds.find((b) => b.buildId === id || (b as any)._id === id);
    }

    if (!foundBuild) {
      res.status(404).json({ success: false, message: 'Build configuration not found.' });
      return;
    }

    // Strict IDOR Protection: Build must belong to the authenticated user or be explicitly public
    if (foundBuild.userId !== userId && !foundBuild.isPublic) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this build configuration.',
      });
      return;
    }

    res.json({ success: true, build: foundBuild });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve build.',
      error: error.message,
    });
  }
};

export const deleteBuild = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const userId = req.user.id;
    const { isInMemoryFallback } = getDbStatus();

    let foundBuild: any = null;

    if (!isInMemoryFallback) {
      try {
        foundBuild = await BuildModel.findOne({
          $or: [{ buildId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
        });
      } catch {
        // Fallback
      }
    }

    if (!foundBuild) {
      foundBuild = inMemoryBuilds.find((b) => b.buildId === id || (b as any)._id === id);
    }

    if (!foundBuild) {
      res.status(404).json({ success: false, message: 'Build not found.' });
      return;
    }

    // Strict IDOR Ownership Check
    if (foundBuild.userId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You cannot delete a build configuration you do not own.',
      });
      return;
    }

    if (!isInMemoryFallback) {
      try {
        await BuildModel.deleteOne({
          $or: [{ buildId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
        });
      } catch {
        // Fallback
      }
    }

    const index = inMemoryBuilds.findIndex((b) => b.buildId === id || (b as any)._id === id);
    if (index !== -1) {
      inMemoryBuilds.splice(index, 1);
    }

    res.json({ success: true, message: 'Build configuration removed successfully.' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete build.',
      error: error.message,
    });
  }
};
