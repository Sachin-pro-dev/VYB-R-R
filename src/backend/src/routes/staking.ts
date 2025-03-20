
import express from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Get all staking pools
router.get('/pools', async (req, res) => {
  try {
    const pools = await prisma.stakingPool.findMany({
      include: {
        token: true,
        creator: true
      }
    });
    
    res.status(200).json(pools);
  } catch (error) {
    console.error('Get pools error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Stake tokens
router.post('/stake/:poolId', verifyToken, async (req, res) => {
  try {
    const { poolId } = req.params;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount required' });
    }
    
    // Check if pool exists
    const pool = await prisma.stakingPool.findUnique({
      where: { id: poolId }
    });
    
    if (!pool) {
      return res.status(404).json({ message: 'Staking pool not found' });
    }
    
    if (amount < pool.minStake) {
      return res.status(400).json({ message: `Minimum stake is ${pool.minStake}` });
    }
    
    // Check if user already has a stake
    const existingStake = await prisma.staking.findUnique({
      where: {
        poolId_userId: {
          poolId,
          userId: req.user?.id as string
        }
      }
    });
    
    if (existingStake) {
      // Add to existing stake
      await prisma.staking.update({
        where: {
          poolId_userId: {
            poolId,
            userId: req.user?.id as string
          }
        },
        data: {
          amount: { increment: amount }
        }
      });
    } else {
      // Create new stake
      await prisma.staking.create({
        data: {
          amount,
          poolId,
          userId: req.user?.id as string
        }
      });
    }
    
    // Update pool total staked
    await prisma.stakingPool.update({
      where: { id: poolId },
      data: {
        totalStaked: { increment: amount }
      }
    });
    
    res.status(200).json({ message: 'Tokens staked successfully' });
  } catch (error) {
    console.error('Stake tokens error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim rewards
router.post('/claim/:stakeId', verifyToken, async (req, res) => {
  try {
    const { stakeId } = req.params;
    
    // Check if stake exists and belongs to user
    const stake = await prisma.staking.findFirst({
      where: {
        id: stakeId,
        userId: req.user?.id as string
      },
      include: {
        pool: true
      }
    });
    
    if (!stake) {
      return res.status(404).json({ message: 'Stake not found' });
    }
    
    if (stake.rewards <= 0) {
      return res.status(400).json({ message: 'No rewards to claim' });
    }
    
    // Reset rewards to 0
    await prisma.staking.update({
      where: { id: stakeId },
      data: { rewards: 0 }
    });
    
    res.status(200).json({ message: 'Rewards claimed successfully', amount: stake.rewards });
  } catch (error) {
    console.error('Claim rewards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stakes
router.get('/my-stakes', verifyToken, async (req, res) => {
  try {
    const stakes = await prisma.staking.findMany({
      where: { userId: req.user?.id as string },
      include: {
        pool: {
          include: {
            token: true,
            creator: true
          }
        }
      }
    });
    
    res.status(200).json(stakes);
  } catch (error) {
    console.error('Get stakes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
