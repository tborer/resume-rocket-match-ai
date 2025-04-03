import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const generateToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestId = req.headers['x-request-id'];
  const prisma = new PrismaClient();

  try {
    // Validate email address
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Generate a unique magic link token
    const magicLinkToken = uuidv4();
    console.log(`[${requestId}] Generated magic link token: ${magicLinkToken}`);

    // Construct the complete magic link URL
    const magicLinkUrl = `https://resume-rocket-match-ai.vercel.app/dashboard?token=${magicLinkToken}`;
    console.log(`[${requestId}] Constructed magic link URL: ${magicLinkUrl}`);

    // Return generated token and URL
    res.json({ token: magicLinkToken, url: magicLinkUrl });
  } catch (error) {
    console.error(`[${requestId}] Error generating token: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate token' });
  }

  // Store token in UserAccess table
  await prisma.userAccess.upsert({
    where: { userId: user.id },
    update: { magicLinkToken },
    create: { userId: user.id, magicLinkToken },
  });
};

export default generateToken;