
import express from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Get all raffles
router.get('/', async (req, res) => {
  try {
    const raffles = await prisma.raffle.findMany({
      orderBy: { endTime: 'asc' }
    });
    
    res.status(200).json(raffles);
  } catch (error) {
    console.error('Get raffles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enter raffle
router.post('/enter/:raffleId', verifyToken, async (req, res) => {
  try {
    const { raffleId } = req.params;
    
    // Check if raffle exists
    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId }
    });
    
    if (!raffle) {
      return res.status(404).json({ message: 'Raffle not found' });
    }
    
    // Check if user already entered
    const existingEntry = await prisma.raffleEntry.findUnique({
      where: {
        raffleId_userId: {
          raffleId,
          userId: req.user?.id as string
        }
      }
    });
    
    if (existingEntry) {
      return res.status(400).json({ message: 'Already entered this raffle' });
    }
    
    // Create entry
    await prisma.raffleEntry.create({
      data: {
        raffleId,
        userId: req.user?.id as string
      }
    });
    
    res.status(200).json({ message: 'Entered raffle successfully' });
  } catch (error) {
    console.error('Enter raffle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new raffle (for admin/creators)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, image, endTime, entryCost, prize } = req.body;
    
    const raffle = await prisma.raffle.create({
      data: {
        name,
        image: image || '/placeholder.svg',
        endTime,
        entryCost,
        prize
      }
    });
    
    res.status(201).json(raffle);
  } catch (error) {
    console.error('Create raffle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
