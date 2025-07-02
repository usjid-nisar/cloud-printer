import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { logger } from '../utils/logger';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse request data against schema
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Request validation failed:', {
          path: req.path,
          errors: error.errors,
        });

        // Format validation errors
        const validationErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validationErrors,
        });
      } else {
        logger.error('Unexpected validation error:', error);
        next(error);
      }
    }
  };
};

// Helper function to validate request body only
export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Request body validation failed:', {
          path: req.path,
          errors: error.errors,
        });

        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        logger.error('Unexpected validation error:', error);
        next(error);
      }
    }
  };
};

// Helper function to validate query parameters only
export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Query parameter validation failed:', {
          path: req.path,
          errors: error.errors,
        });

        res.status(400).json({
          status: 'error',
          message: 'Invalid query parameters',
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        logger.error('Unexpected validation error:', error);
        next(error);
      }
    }
  };
};

// Helper function to validate URL parameters only
export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('URL parameter validation failed:', {
          path: req.path,
          errors: error.errors,
        });

        res.status(400).json({
          status: 'error',
          message: 'Invalid URL parameters',
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        logger.error('Unexpected validation error:', error);
        next(error);
      }
    }
  };
}; 