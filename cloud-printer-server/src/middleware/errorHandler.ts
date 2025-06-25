import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { AuditService, AuditEventType } from '../services/auditService';
import { Prisma } from '@prisma/client';

const auditService = new AuditService();

export const errorHandler = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details: any = undefined;

  // Handle different types of errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;

    // Log application errors
    await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
      partnerId: req.partner?.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        error: error.message,
        code: error.statusCode,
        path: req.path,
      },
    });
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Resource already exists';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid foreign key constraint';
        break;
      default:
        message = 'Database error occurred';
    }

    // Log database errors
    await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
      partnerId: req.partner?.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        code: error.code,
        message: error.message,
        path: req.path,
      },
    });
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';

    // Log authentication errors
    await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        error: error.message,
        path: req.path,
      },
    });
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
    }),
  });
};

// Handle 404 errors
export const notFoundHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new AppError(`Route ${req.path} not found`, 404);

  // Log 404 errors
  await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
    partnerId: req.partner?.id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    details: {
      path: req.path,
      method: req.method,
    },
  });

  next(error);
};

// Handle uncaught exceptions
export const uncaughtExceptionHandler = (error: Error) => {
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack,
  });

  // Log critical errors
  auditService
    .logEvent(AuditEventType.SECURITY_EVENT, {
      details: {
        error: error.message,
        stack: error.stack,
        timestamp: new Date(),
      },
    })
    .finally(() => {
      // Exit process after logging
      process.exit(1);
    });
};

// Handle unhandled promise rejections
export const unhandledRejectionHandler = (
  reason: any,
  promise: Promise<any>
) => {
  logger.error('Unhandled Promise Rejection:', {
    reason,
    promise,
  });

  // Log critical errors
  auditService
    .logEvent(AuditEventType.SECURITY_EVENT, {
      details: {
        reason,
        timestamp: new Date(),
      },
    })
    .finally(() => {
      // Exit process after logging
      process.exit(1);
    });
}; 