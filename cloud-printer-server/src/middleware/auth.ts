import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { AuditService, AuditEventType } from '../services/auditService';
import { AuthService } from '../services/authService';

const prisma = new PrismaClient();
const auditService = new AuditService();
const authService = new AuthService();

// Extend Express Request type to include partner and user
declare global {
  namespace Express {
    interface Request {
      partner?: {
        id: string;
        name: string;
        email: string;
      };
      user?: any;
    }
  }
}

export const authenticatePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new AppError('API key is required', 401);
    }

    // Hash the API key for comparison
    const hashedKey = createHash('sha256').update(apiKey).digest('hex');

    // Find partner by API key
    const partner = await prisma.partner.findUnique({
      where: { apiKey: hashedKey },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!partner) {
      await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: {
          error: 'Invalid API key',
          path: req.path,
        },
      });

      throw new AppError('Invalid API key', 401);
    }

    // Attach partner info to request
    req.partner = partner;

    // Log successful authentication
    await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
      partnerId: partner.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        event: 'Authentication successful',
        path: req.path,
      },
    });

    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    next(error);
  }
};

export const authorizePartner = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const partnerId = req.partner?.id;

      if (!partnerId) {
        throw new AppError('Unauthorized', 401);
      }

      // Get partner's roles/permissions
      const partner = await prisma.partner.findUnique({
        where: { id: partnerId },
        select: {
          id: true,
          // Add any role/permission fields here
        },
      });

      if (!partner) {
        throw new AppError('Partner not found', 404);
      }

      // Check if partner has required roles
      // This is a placeholder for role-based authorization
      // Implement according to your role/permission model
      const hasPermission = true; // Replace with actual role check

      if (!hasPermission) {
        await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
          partnerId: partnerId,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: {
            requiredRoles: allowedRoles,
            path: req.path,
          },
        });

        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      logger.error('Authorization failed:', error);
      next(error);
    }
  };
};

export const validatePartnerAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const partnerId = req.params.partnerId || req.body.partnerId;
    const authenticatedPartnerId = req.partner?.id;

    if (!authenticatedPartnerId) {
      throw new AppError('Unauthorized', 401);
    }

    if (partnerId !== authenticatedPartnerId) {
      await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
        partnerId: authenticatedPartnerId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: {
          attemptedPartnerId: partnerId,
          path: req.path,
        },
      });

      throw new AppError('Access denied', 403);
    }

    next();
  } catch (error) {
    logger.error('Partner access validation failed:', error);
    next(error);
  }
};

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: {
          error: 'Missing API key',
          path: req.path,
        },
      });
      throw new AppError('API key is required', 401);
    }

    const partner = await prisma.partner.findFirst({
      where: {
        apiKey: apiKey as string,
      },
    });

    if (!partner) {
      await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: {
          error: 'Invalid API key',
          path: req.path,
        },
      });
      throw new AppError('Invalid API key', 401);
    }

    // Attach partner to request
    req.partner = partner;

    // Log successful authentication
    await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
      partnerId: partner.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        event: 'Authentication successful',
        path: req.path,
      },
    });

    next();
  } catch (error) {
    next(error);
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const user = await authService.validateSession(token);
    if (!user) {
      throw new AppError('Invalid or expired token', 401);
    }

    // Verify user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // For client users, verify partner exists and is active
    if (user.role === 'client' && user.partnerId) {
      const partner = await prisma.partner.findUnique({
        where: { id: user.partnerId }
      });
      
      if (!partner) {
        throw new AppError('Invalid partner association', 401);
      }
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
        partnerId: req.user.partnerId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: {
          event: 'unauthorized_access_attempt',
          requiredRoles: roles,
          userRole: req.user.role,
          path: req.path,
        },
      });
      return next(new AppError('Unauthorized access', 403));
    }

    next();
  };
};

// Middleware to ensure client users can only access their partner's data
export const restrictToPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  // Admin can access all partner data
  if (req.user.role === 'admin') {
    return next();
  }

  // Client users can only access their partner's data
  const requestedPartnerId = req.params.partnerId || req.body.partnerId;
  if (!requestedPartnerId) {
    return next(new AppError('Partner ID is required', 400));
  }

  if (req.user.partnerId !== requestedPartnerId) {
    await auditService.logEvent(AuditEventType.SECURITY_EVENT, {
      partnerId: req.user.partnerId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        event: 'unauthorized_partner_access_attempt',
        requestedPartnerId,
        userPartnerId: req.user.partnerId,
        path: req.path,
      },
    });
    return next(new AppError('Unauthorized access', 403));
  }

  // Verify partner exists and is active
  const partner = await prisma.partner.findUnique({
    where: { id: requestedPartnerId }
  });

  if (!partner) {
    return next(new AppError('Partner not found', 404));
  }

  next();
}; 