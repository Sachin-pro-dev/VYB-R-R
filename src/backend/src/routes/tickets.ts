
import express from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Create ticket event
router.post('/events', verifyToken, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      date, 
      time, 
      maxAttendees, 
      price, 
      image, 
      tokenGated 
    } = req.body;
    
    // Get creator info
    const creator = await prisma.user.findUnique({
      where: { id: req.user?.id }
    });
    
    if (!creator || !creator.handle) {
      return res.status(400).json({ message: 'Creator profile incomplete' });
    }
    
    // Create event
    const event = await prisma.ticketEvent.create({
      data: {
        title,
        description,
        creator: creator.username || 'Creator',
        creatorHandle: creator.handle,
        date,
        time,
        maxAttendees,
        price,
        image: image || '/placeholder.svg',
        tokenGated: tokenGated || false,
        status: 'upcoming' // Default status
      }
    });
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events
router.get('/events', async (req, res) => {
  try {
    const { status } = req.query;
    
    const whereClause = status ? { status: status as string } : {};
    
    const events = await prisma.ticketEvent.findMany({
      where: whereClause,
      orderBy: { date: 'asc' }
    });
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Buy ticket
router.post('/buy/:eventId', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Check if event exists and tickets available
    const event = await prisma.ticketEvent.findUnique({
      where: { id: eventId }
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.attendees >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event sold out' });
    }
    
    // Check if user already has a ticket
    const existingTicket = await prisma.ticket.findUnique({
      where: {
        eventId_ownerId: {
          eventId,
          ownerId: req.user?.id as string
        }
      }
    });
    
    if (existingTicket) {
      return res.status(400).json({ message: 'You already have a ticket for this event' });
    }
    
    // Create ticket and update event attendees
    await prisma.ticket.create({
      data: {
        eventId,
        ownerId: req.user?.id as string
      }
    });
    
    await prisma.ticketEvent.update({
      where: { id: eventId },
      data: { attendees: { increment: 1 } }
    });
    
    res.status(201).json({ message: 'Ticket purchased successfully' });
  } catch (error) {
    console.error('Buy ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user tickets
router.get('/my-tickets', verifyToken, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { ownerId: req.user?.id as string },
      include: {
        event: true
      }
    });
    
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
