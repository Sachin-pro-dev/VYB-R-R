
import express from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: {
        token: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (onboarding)
router.put('/onboarding', verifyToken, async (req, res) => {
  try {
    const { username, handle, bio, avatar, banner, interests } = req.body;
    
    // Check if handle is already taken
    if (handle) {
      const existingUser = await prisma.user.findUnique({
        where: { handle }
      });
      
      if (existingUser && existingUser.id !== req.user?.id) {
        return res.status(400).json({ message: 'Handle already taken' });
      }
    }
    
    // Update user profile
    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data: {
        username,
        handle,
        bio,
        avatar,
        banner
      }
    });
    
    // Update user interests if provided
    if (interests && interests.length > 0) {
      // Clear existing interests and add new ones
      await prisma.user.update({
        where: { id: req.user?.id },
        data: {
          interests: {
            connect: interests.map((interest: string) => ({ name: interest }))
          }
        }
      });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by handle
router.get('/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { handle },
      include: {
        token: true,
        nfts: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow a user
router.post('/follow/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user?.id as string,
          followingId: id
        }
      }
    });
    
    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }
    
    // Create follow relationship
    await prisma.follow.create({
      data: {
        followerId: req.user?.id as string,
        followingId: id
      }
    });
    
    // Update follower and following counts
    await prisma.user.update({
      where: { id: req.user?.id },
      data: { following: { increment: 1 } }
    });
    
    await prisma.user.update({
      where: { id },
      data: { followers: { increment: 1 } }
    });
    
    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow a user
router.delete('/follow/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete follow relationship if exists
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user?.id as string,
          followingId: id
        }
      }
    });
    
    if (!follow) {
      return res.status(400).json({ message: 'Not following this user' });
    }
    
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: req.user?.id as string,
          followingId: id
        }
      }
    });
    
    // Update follower and following counts
    await prisma.user.update({
      where: { id: req.user?.id },
      data: { following: { decrement: 1 } }
    });
    
    await prisma.user.update({
      where: { id },
      data: { followers: { decrement: 1 } }
    });
    
    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get top creators
router.get('/', async (req, res) => {
  try {
    const creators = await prisma.user.findMany({
      where: { isCreator: true },
      take: 10,
      orderBy: { followers: 'desc' },
      include: { token: true }
    });
    
    res.status(200).json(creators);
  } catch (error) {
    console.error('Get creators error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
