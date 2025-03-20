
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Clean up existing data
    console.log('Cleaning up existing data...');
    await cleanDatabase();
    
    // Create interests
    console.log('Creating interests...');
    const interests = await createInterests();
    
    // Create users
    console.log('Creating users...');
    const users = await createUsers(interests);
    
    // Create creator tokens
    console.log('Creating creator tokens...');
    const tokens = await createCreatorTokens(users);
    
    // Create staking pools
    console.log('Creating staking pools...');
    await createStakingPools(tokens);
    
    // Create user posts
    console.log('Creating posts...');
    const posts = await createPosts(users);
    
    // Create comments
    console.log('Creating comments...');
    await createComments(users, posts);
    
    // Create likes
    console.log('Creating likes...');
    await createLikes(users, posts);
    
    // Create follows
    console.log('Creating follows...');
    await createFollows(users);
    
    // Create events
    console.log('Creating events...');
    await createEvents(users);
    
    // Create raffles
    console.log('Creating raffles...');
    await createRaffles(users);
    
    // Create NFTs
    console.log('Creating NFTs...');
    await createNFTs(users);
    
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function cleanDatabase() {
  // Delete data in reverse order of dependencies
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.ticketEvent.deleteMany();
  await prisma.raffleEntry.deleteMany();
  await prisma.raffle.deleteMany();
  await prisma.staking.deleteMany();
  await prisma.stakingPool.deleteMany();
  await prisma.creatorToken.deleteMany();
  await prisma.nFT.deleteMany();
  await prisma.follow.deleteMany();
  
  // Clear connecting tables
  await prisma.$executeRaw`DELETE FROM "_InterestToUser"`;
  
  // Clear main tables
  await prisma.interest.deleteMany();
  await prisma.user.deleteMany();
}

async function createInterests() {
  const interestData = [
    { name: 'Blockchain', category: 'Technology' },
    { name: 'Ethereum', category: 'Cryptocurrency' },
    { name: 'NFTs', category: 'Digital Assets' },
    { name: 'Music', category: 'Entertainment' },
    { name: 'Gaming', category: 'Entertainment' },
    { name: 'Art', category: 'Creative' },
    { name: 'DeFi', category: 'Finance' },
    { name: 'Web3', category: 'Technology' },
    { name: 'Metaverse', category: 'Virtual Reality' },
    { name: 'DAOs', category: 'Organization' }
  ];
  
  return await Promise.all(
    interestData.map(interest => 
      prisma.interest.create({ data: interest })
    )
  );
}

async function createUsers(interests: any[]) {
  // Create 5 sample users
  const users = [];
  
  // Create admin user
  users.push(await prisma.user.create({
    data: {
      username: 'Admin',
      handle: 'admin',
      walletAddress: '0x1234567890123456789012345678901234567890',
      bio: 'Platform administrator',
      avatar: '/placeholder.svg',
      banner: '/placeholder.svg',
      isCreator: true,
      followers: 0,
      following: 0,
      tokenHolders: 0,
      interests: {
        connect: interests.map(interest => ({ id: interest.id }))
      }
    }
  }));
  
  // Create sample users
  const sampleUsers = [
    {
      username: 'Alice Crypto',
      handle: 'alice',
      walletAddress: '0x2234567890123456789012345678901234567890',
      bio: 'NFT artist and crypto enthusiast',
      avatar: '/placeholder.svg',
      banner: '/placeholder.svg',
      isCreator: true
    },
    {
      username: 'Bob Builder',
      handle: 'bob',
      walletAddress: '0x3234567890123456789012345678901234567890',
      bio: 'Building the future of Web3',
      avatar: '/placeholder.svg',
      banner: '/placeholder.svg',
      isCreator: true
    },
    {
      username: 'Charlie Chain',
      handle: 'charlie',
      walletAddress: '0x4234567890123456789012345678901234567890',
      bio: 'Blockchain developer and educator',
      avatar: '/placeholder.svg',
      banner: '/placeholder.svg',
      isCreator: false
    },
    {
      username: 'Dana Decentralized',
      handle: 'dana',
      walletAddress: '0x5234567890123456789012345678901234567890',
      bio: 'Passionate about decentralization and DAOs',
      avatar: '/placeholder.svg',
      banner: '/placeholder.svg',
      isCreator: false
    }
  ];
  
  for (const userData of sampleUsers) {
    // Randomly assign 2-4 interests to each user
    const userInterests = interests
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 2);
    
    users.push(await prisma.user.create({
      data: {
        ...userData,
        followers: Math.floor(Math.random() * 100),
        following: Math.floor(Math.random() * 50),
        tokenHolders: userData.isCreator ? Math.floor(Math.random() * 200) : 0,
        interests: {
          connect: userInterests.map(interest => ({ id: interest.id }))
        }
      }
    }));
  }
  
  return users;
}

async function createCreatorTokens(users: any[]) {
  const tokens = [];
  const creatorUsers = users.filter(user => user.isCreator);
  
  for (const user of creatorUsers) {
    const token = await prisma.creatorToken.create({
      data: {
        tokenSymbol: user.handle.toUpperCase(),
        tokenName: `${user.username} Token`,
        currentPrice: Math.random() * 10 + 1, // Random price between 1 and 11
        priceChange: Math.random() * 20 - 10, // Random change between -10% and +10%
        marketCap: Math.random() * 1000000 + 10000,
        volume: Math.random() * 100000,
        holders: Math.floor(Math.random() * 1000) + 10,
        creatorId: user.id
      }
    });
    
    tokens.push(token);
  }
  
  return tokens;
}

async function createStakingPools(tokens: any[]) {
  for (const token of tokens) {
    await prisma.stakingPool.create({
      data: {
        name: `${token.tokenName} Staking`,
        apy: Math.random() * 20 + 5, // Random APY between 5% and 25%
        lockPeriod: '30 days',
        minStake: 10,
        totalStaked: Math.random() * 100000,
        isCreatorToken: true,
        tokenPrice: token.currentPrice,
        tokenId: token.id,
        creatorId: token.creatorId
      }
    });
  }
}

async function createPosts(users: any[]) {
  const posts = [];
  const postContents = [
    'Just launched my new NFT collection! Check it out 🚀',
    'Excited to announce my upcoming livestream about the future of Web3',
    'What do you think about the latest Ethereum update?',
    'Working on something special for my token holders. Stay tuned! 🔒',
    'Thoughts on the current state of the metaverse?',
    'Just minted my first NFT, feeling proud!',
    'Join my Discord community for exclusive content and opportunities!',
    'The future of social media is decentralized 🌐',
    'What blockchain projects are you most excited about right now?',
    'Just hit 1000 token holders! Thank you for the support ❤️',
    'Building in the bear market is where the real innovation happens',
    'Exploring new ways to reward my community',
    'Should I launch a podcast about crypto and web3?',
    'Voting now open for my next community event! Link in bio',
    'The line between virtual and reality is blurring every day'
  ];
  
  for (const user of users) {
    // Create 1-5 posts per user
    const postCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < postCount; i++) {
      const randomContent = postContents[Math.floor(Math.random() * postContents.length)];
      const isTokenGated = Math.random() > 0.8; // 20% chance of being token-gated
      
      posts.push(await prisma.post.create({
        data: {
          content: randomContent,
          image: Math.random() > 0.7 ? '/placeholder.svg' : undefined, // 30% chance of having an image
          likes: 0,
          comments: 0,
          shares: Math.floor(Math.random() * 10),
          reposts: Math.floor(Math.random() * 5),
          isTokenGated,
          authorId: user.id
        }
      }));
    }
  }
  
  return posts;
}

async function createComments(users: any[], posts: any[]) {
  const commentContents = [
    'Great post!',
    'Interesting perspective 🤔',
    'I completely agree with you',
    'Thanks for sharing this',
    'Can\'t wait to see more',
    'This is really cool',
    'Awesome work!',
    'Looking forward to what\'s next',
    'I have a different view on this actually...',
    'Mind blown 🤯'
  ];
  
  for (const post of posts) {
    // Add 0-3 comments per post
    const commentCount = Math.floor(Math.random() * 4);
    
    for (let i = 0; i < commentCount; i++) {
      // Random user (not the author) leaves a comment
      const commenters = users.filter(user => user.id !== post.authorId);
      const commenter = commenters[Math.floor(Math.random() * commenters.length)];
      
      const randomContent = commentContents[Math.floor(Math.random() * commentContents.length)];
      
      await prisma.comment.create({
        data: {
          content: randomContent,
          postId: post.id,
          authorId: commenter.id
        }
      });
      
      // Update post comment count
      await prisma.post.update({
        where: { id: post.id },
        data: { comments: { increment: 1 } }
      });
    }
  }
}

async function createLikes(users: any[], posts: any[]) {
  for (const post of posts) {
    // Add 0-10 likes per post
    const likeCount = Math.floor(Math.random() * 11);
    
    // Random users (not the author) like the post
    const potentialLikers = users.filter(user => user.id !== post.authorId);
    const likers = potentialLikers
      .sort(() => 0.5 - Math.random())
      .slice(0, likeCount);
    
    for (const user of likers) {
      await prisma.like.create({
        data: {
          postId: post.id,
          userId: user.id
        }
      });
    }
    
    // Update post like count
    await prisma.post.update({
      where: { id: post.id },
      data: { likes: likeCount }
    });
  }
}

async function createFollows(users: any[]) {
  // Create follow relationships between users
  for (const follower of users) {
    // Each user follows 0-3 random other users
    const followCount = Math.floor(Math.random() * 4);
    
    const potentialFollowees = users.filter(user => user.id !== follower.id);
    const followees = potentialFollowees
      .sort(() => 0.5 - Math.random())
      .slice(0, followCount);
    
    for (const followee of followees) {
      await prisma.follow.create({
        data: {
          followerId: follower.id,
          followingId: followee.id
        }
      });
      
      // Update user stats
      await prisma.user.update({
        where: { id: follower.id },
        data: { following: { increment: 1 } }
      });
      
      await prisma.user.update({
        where: { id: followee.id },
        data: { followers: { increment: 1 } }
      });
    }
  }
}

async function createEvents(users: any[]) {
  const eventTitles = [
    'Web3 Developers Meetup',
    'NFT Showcase 2023',
    'DeFi Workshop Series',
    'Crypto Market Analysis',
    'Metaverse Experience Demo'
  ];
  
  const eventDescriptions = [
    'Join us for a developer-focused event where we\'ll discuss the latest trends in Web3 development.',
    'A showcase of the most innovative NFT projects with live demonstrations from creators.',
    'Learn about the fundamentals of DeFi and how to participate in various protocols.',
    'Expert analysis of current market trends and predictions for the future of cryptocurrency.',
    'Experience the metaverse firsthand with our interactive demo session.'
  ];
  
  const creatorUsers = users.filter(user => user.isCreator);
  
  for (let i = 0; i < 5; i++) {
    const creator = creatorUsers[Math.floor(Math.random() * creatorUsers.length)];
    const tokenGated = Math.random() > 0.7; // 30% chance of being token-gated
    
    // Generate random date in the next 30 days
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 30) + 1);
    
    await prisma.ticketEvent.create({
      data: {
        title: eventTitles[i],
        description: eventDescriptions[i],
        creator: creator.username,
        creatorHandle: creator.handle,
        date: eventDate.toISOString().split('T')[0],
        time: '18:00',
        maxAttendees: 100,
        attendees: Math.floor(Math.random() * 50),
        price: Math.floor(Math.random() * 100) + 10,
        image: '/placeholder.svg',
        tokenGated,
        status: 'upcoming'
      }
    });
  }
}

async function createRaffles(users: any[]) {
  const raffleNames = [
    'Exclusive NFT Giveaway',
    'Creator Token Airdrop',
    'VIP Access Pass Raffle',
    '100 USDC Prize Pool',
    'Limited Edition Merch'
  ];
  
  for (let i = 0; i < 5; i++) {
    // End date in the next 14 days
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 14) + 1);
    
    await prisma.raffle.create({
      data: {
        name: raffleNames[i],
        image: '/placeholder.svg',
        endTime: endDate.toISOString(),
        entryCost: Math.floor(Math.random() * 50) + 5,
        prize: `${Math.floor(Math.random() * 500) + 100} USDC`
      }
    });
  }
}

async function createNFTs(users: any[]) {
  const nftNames = [
    'Cosmic Explorer',
    'Digital Genesis',
    'Ethereal Essence',
    'Quantum Fragment',
    'Virtual Horizon',
    'Neon Dreams',
    'Pixel Pioneer',
    'Blockchain Artifact',
    'Cryptic Creation',
    'Metaverse Monument'
  ];
  
  for (const user of users) {
    // Each user has 0-3 NFTs
    const nftCount = Math.floor(Math.random() * 4);
    
    for (let i = 0; i < nftCount; i++) {
      const randomNftName = nftNames[Math.floor(Math.random() * nftNames.length)];
      
      await prisma.nFT.create({
        data: {
          name: `${randomNftName} #${Math.floor(Math.random() * 1000)}`,
          image: '/placeholder.svg',
          ownerId: user.id
        }
      });
    }
  }
}

// Execute the seed function
seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
