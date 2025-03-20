
import express from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Create creator token
router.post('/', verifyToken, async (req, res) => {
  try {
    const { tokenSymbol, tokenName, initialPrice } = req.body;
    
    // Check if token symbol already exists
    const existingToken = await prisma.creatorToken.findUnique({
      where: { tokenSymbol }
    });
    
    if (existingToken) {
      return res.status(400).json({ message: 'Token symbol already exists' });
    }
    
    // Check if user already has a token
    const userToken = await prisma.creatorToken.findUnique({
      where: { creatorId: req.user?.id as string }
    });
    
    if (userToken) {
      return res.status(400).json({ message: 'User already has a creator token' });
    }
    
    // Create token
    const token = await prisma.creatorToken.create({
      data: {
        tokenSymbol,
        tokenName,
        currentPrice: initialPrice || 1.0,
        priceChange: 0,
        marketCap: initialPrice * 1000, // Initial market cap
        volume: 0,
        holders: 0,
        creatorId: req.user?.id as string
      }
    });
    
    // Update user to be a creator
    await prisma.user.update({
      where: { id: req.user?.id },
      data: { isCreator: true }
    });
    
    // Create staking pool for token
    await prisma.stakingPool.create({
      data: {
        name: tokenName,
        apy: 12.5, // Default APY
        lockPeriod: '30 days',
        minStake: 10,
        isCreatorToken: true,
        tokenPrice: initialPrice || 1.0,
        tokenId: token.id,
        creatorId: req.user?.id as string
      }
    });
    
    res.status(201).json(token);
  } catch (error) {
    console.error('Create token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get token by symbol
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const token = await prisma.creatorToken.findUnique({
      where: { tokenSymbol: symbol },
      include: {
        creator: true
      }
    });
    
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    
    res.status(200).json(token);
  } catch (error) {
    console.error('Get token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending tokens
router.get('/', async (req, res) => {
  try {
    const tokens = await prisma.creatorToken.findMany({
      orderBy: { volume: 'desc' },
      take: 10,
      include: {
        creator: true
      }
    });
    
    res.status(200).json(tokens);
  } catch (error) {
    console.error('Get tokens error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
