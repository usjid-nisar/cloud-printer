import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

// Extend Express Request type to include partner
declare global {
  namespace Express {
    interface Request {
      partner?: any;
    }
  }
}

export const authenticatePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      throw new AppError('API key is required', 401);
    }

    const partner = await prisma.partner.findUnique({
      where: { apiKey: String(apiKey) },
    });

    if (!partner) {
      throw new AppError('Invalid API key', 401);
    }

    // Attach partner to request object
    req.partner = partner;
    next();
  } catch (error) {
    next(error);
  }
}; 