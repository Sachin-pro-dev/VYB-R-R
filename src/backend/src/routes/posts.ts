
import express from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Create a post
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, image, isTokenGated } = req.body;
    
    if (!content && !image) {
      return res.status(400).json({ message: 'Post must have content or image' });
    }
    
    const post = await prisma.post.create({
      data: {
        content: content || '',
        image,
        isTokenGated: isTokenGated || false,
        authorId: req.user?.id as string
      },
      include: {
        author: true
      }
    });
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feed posts
router.get('/feed', verifyToken, async (req, res) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    
    // Get user's following list
    const following = await prisma.follow.findMany({
      where: { followerId: req.user?.id },
      select: { followingId: true }
    });
    
    const followingIds = following.map(f => f.followingId);
    
    // Include user's own posts
    followingIds.push(req.user?.id as string);
    
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: { in: followingIds } },
          { isTokenGated: false } // Include non-token-gated posts from everyone
        ]
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
      include: {
        author: true
      }
    });
    
    const totalPosts = await prisma.post.count({
      where: {
        OR: [
          { authorId: { in: followingIds } },
          { isTokenGated: false }
        ]
      }
    });
    
    res.status(200).json({
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalPosts / limitNum),
        totalItems: totalPosts
      }
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user posts
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
      include: {
        author: true
      }
    });
    
    const totalPosts = await prisma.post.count({
      where: { authorId: userId }
    });
    
    res.status(200).json({
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalPosts / limitNum),
        totalItems: totalPosts
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a post
router.post('/:postId/like', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: req.user?.id as string
        }
      }
    });
    
    if (existingLike) {
      return res.status(400).json({ message: 'Post already liked' });
    }
    
    // Create like and update post like count
    await prisma.like.create({
      data: {
        postId,
        userId: req.user?.id as string
      }
    });
    
    await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } }
    });
    
    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unlike a post
router.delete('/:postId/like', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Delete like if exists
    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: req.user?.id as string
        }
      }
    });
    
    if (!like) {
      return res.status(400).json({ message: 'Post not liked' });
    }
    
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId: req.user?.id as string
        }
      }
    });
    
    // Update post like count
    await prisma.post.update({
      where: { id: postId },
      data: { likes: { decrement: 1 } }
    });
    
    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to a post
router.post('/:postId/comment', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: req.user?.id as string
      },
      include: {
        author: true
      }
    });
    
    // Update post comment count
    await prisma.post.update({
      where: { id: postId },
      data: { comments: { increment: 1 } }
    });
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get post comments
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
      include: {
        author: true
      }
    });
    
    const totalComments = await prisma.comment.count({
      where: { postId }
    });
    
    res.status(200).json({
      comments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalComments / limitNum),
        totalItems: totalComments
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
