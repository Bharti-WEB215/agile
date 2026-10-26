import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { sendApiError } from '../apiError';

const router = Router();

// GET /api/users - Get all users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    });

    res.json(users);
  } catch (error) {
    sendApiError(res, error, 'Users GET error:', 'Failed to fetch users');
  }
});

export default router;
