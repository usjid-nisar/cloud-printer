import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    logger.error(`AppError: ${error.message}`, {
      stack: error.stack,
      originalError: error.originalError,
    });

    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(`Database Error: ${error.message}`, {
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });

    // Handle common Prisma errors
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          status: 'error',
          message: 'A unique constraint violation occurred',
        });
      case 'P2025':
        return res.status(404).json({
          status: 'error',
          message: 'Record not found',
        });
      default:
        return res.status(500).json({
          status: 'error',
          message: 'An unexpected database error occurred',
        });
    }
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    logger.error(`Validation Error: ${error.message}`);
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.message,
    });
  }

  // Handle unknown errors
  logger.error('Unhandled Error:', error);
  return res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}; 