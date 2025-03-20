
import express from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Get user NFTs
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const nfts = await prisma.nFT.findMany({
      where: { ownerId: userId }
    });
    
    res.status(200).json(nfts);
  } catch (error) {
    console.error('Get NFTs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mint NFT
router.post('/mint', verifyToken, async (req, res) => {
  try {
    const { name, image } = req.body;
    
    if (!name || !image) {
      return res.status(400).json({ message: 'Name and image required' });
    }
    
    const nft = await prisma.nFT.create({
      data: {
        name,
        image,
        ownerId: req.user?.id as string
      }
    });
    
    res.status(201).json(nft);
  } catch (error) {
    console.error('Mint NFT error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
