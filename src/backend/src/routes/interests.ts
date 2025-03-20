
import express from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Get all interests
router.get('/', async (req, res) => {
  try {
    const interests = await prisma.interest.findMany();
    
    res.status(200).json(interests);
  } catch (error) {
    console.error('Get interests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new interest
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, category } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Interest name is required' });
    }
    
    // Check if interest already exists
    const existingInterest = await prisma.interest.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });
    
    if (existingInterest) {
      return res.status(400).json({ message: 'Interest already exists' });
    }
    
    const interest = await prisma.interest.create({
      data: {
        name,
        category: category || 'General'
      }
    });
    
    res.status(201).json(interest);
  } catch (error) {
    console.error('Create interest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add user interests
router.post('/user', verifyToken, async (req, res) => {
  try {
    const { userId, interestIds } = req.body;
    
    if (!interestIds || !Array.isArray(interestIds)) {
      return res.status(400).json({ message: 'Interest IDs array required' });
    }
    
    // Use authenticated user if userId not provided
    const targetUserId = userId || req.user?.id;
    
    if (!targetUserId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: targetUserId }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify all interests exist
    const existingInterests = await prisma.interest.findMany({
      where: { id: { in: interestIds } }
    });
    
    if (existingInterests.length !== interestIds.length) {
      return res.status(400).json({ message: 'One or more interests not found' });
    }
    
    // Add interests to user
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        interests: {
          connect: interestIds.map(id => ({ id }))
        }
      }
    });
    
    res.status(200).json({ message: 'Interests added successfully' });
  } catch (error) {
    console.error('Add interests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove user interest
router.delete('/user/:interestId', verifyToken, async (req, res) => {
  try {
    const { interestId } = req.params;
    
    const user = await prisma.user.update({
      where: { id: req.user?.id as string },
      data: {
        interests: {
          disconnect: { id: interestId }
        }
      }
    });
    
    res.status(200).json({ message: 'Interest removed successfully' });
  } catch (error) {
    console.error('Remove interest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user interests
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        interests: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user.interests);
  } catch (error) {
    console.error('Get user interests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
