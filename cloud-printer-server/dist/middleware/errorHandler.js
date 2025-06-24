"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unhandledRejectionHandler = exports.uncaughtExceptionHandler = exports.notFoundHandler = exports.errorHandler = void 0;
const zod_1 = require("zod");
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
const auditService_1 = require("../services/auditService");
const client_1 = require("@prisma/client");
const auditService = new auditService_1.AuditService();
const errorHandler = async (error, req, res, next) => {
    // Log the error
    logger_1.logger.error('Error occurred:', {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
    });
    // Default error response
    let statusCode = 500;
    let message = 'Internal server error';
    let details = undefined;
    // Handle different types of errors
    if (error instanceof AppError_1.AppError) {
        statusCode = error.statusCode;
        message = error.message;
        details = error.details;
        // Log application errors
        await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
            partnerId: req.partner?.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            details: {
                error: error.message,
                code: error.statusCode,
                path: req.path,
            },
        });
    }
    else if (error instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Validation failed';
        details = error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
        }));
    }
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
        await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
            partnerId: req.partner?.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            details: {
                code: error.code,
                message: error.message,
                path: req.path,
            },
        });
    }
    else if (error.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
        // Log authentication errors
        await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
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
exports.errorHandler = errorHandler;
// Handle 404 errors
const notFoundHandler = async (req, res, next) => {
    const error = new AppError_1.AppError(`Route ${req.path} not found`, 404);
    // Log 404 errors
    await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
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
exports.notFoundHandler = notFoundHandler;
// Handle uncaught exceptions
const uncaughtExceptionHandler = (error) => {
    logger_1.logger.error('Uncaught Exception:', {
        error: error.message,
        stack: error.stack,
    });
    // Log critical errors
    auditService
        .logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
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
exports.uncaughtExceptionHandler = uncaughtExceptionHandler;
// Handle unhandled promise rejections
const unhandledRejectionHandler = (reason, promise) => {
    logger_1.logger.error('Unhandled Promise Rejection:', {
        reason,
        promise,
    });
    // Log critical errors
    auditService
        .logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
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
exports.unhandledRejectionHandler = unhandledRejectionHandler;
