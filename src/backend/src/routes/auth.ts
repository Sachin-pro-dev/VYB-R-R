
import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const router = express.Router();

// Authenticate user with wallet address
router.post('/wallet-auth', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }
    
    // Find or create user with wallet address
    let user = await prisma.user.findUnique({
      where: { walletAddress }
    });
    
    if (!user) {
      // Create new user if not exists
      user = await prisma.user.create({
        data: {
          walletAddress,
          avatar: '/placeholder.svg', // Default avatar
          banner: '/placeholder.svg', // Default banner
        }
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );
    
    res.status(200).json({
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        handle: user.handle,
        avatar: user.avatar,
        isOnboarded: user.username && user.handle ? true : false
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if user has completed onboarding
router.get('/onboarding-status', async (req, res) => {
  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress as string }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      isOnboarded: user.username && user.handle ? true : false
    });
  } catch (error) {
    console.error('Onboarding status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
