"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiKey = exports.validatePartnerAccess = exports.authorizePartner = exports.authenticatePartner = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
const auditService_1 = require("../services/auditService");
const prisma = new client_1.PrismaClient();
const auditService = new auditService_1.AuditService();
const authenticatePartner = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            throw new AppError_1.AppError('API key is required', 401);
        }
        // Hash the API key for comparison
        const hashedKey = (0, crypto_1.createHash)('sha256').update(apiKey).digest('hex');
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
            await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                details: {
                    error: 'Invalid API key',
                    path: req.path,
                },
            });
            throw new AppError_1.AppError('Invalid API key', 401);
        }
        // Attach partner info to request
        req.partner = partner;
        // Log successful authentication
        await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
            partnerId: partner.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            details: {
                event: 'Authentication successful',
                path: req.path,
            },
        });
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication failed:', error);
        next(error);
    }
};
exports.authenticatePartner = authenticatePartner;
const authorizePartner = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const partnerId = req.partner?.id;
            if (!partnerId) {
                throw new AppError_1.AppError('Unauthorized', 401);
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
                throw new AppError_1.AppError('Partner not found', 404);
            }
            // Check if partner has required roles
            // This is a placeholder for role-based authorization
            // Implement according to your role/permission model
            const hasPermission = true; // Replace with actual role check
            if (!hasPermission) {
                await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
                    partnerId: partnerId,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                    details: {
                        requiredRoles: allowedRoles,
                        path: req.path,
                    },
                });
                throw new AppError_1.AppError('Insufficient permissions', 403);
            }
            next();
        }
        catch (error) {
            logger_1.logger.error('Authorization failed:', error);
            next(error);
        }
    };
};
exports.authorizePartner = authorizePartner;
const validatePartnerAccess = async (req, res, next) => {
    try {
        const partnerId = req.params.partnerId || req.body.partnerId;
        const authenticatedPartnerId = req.partner?.id;
        if (!authenticatedPartnerId) {
            throw new AppError_1.AppError('Unauthorized', 401);
        }
        if (partnerId !== authenticatedPartnerId) {
            await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
                partnerId: authenticatedPartnerId,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                details: {
                    attemptedPartnerId: partnerId,
                    path: req.path,
                },
            });
            throw new AppError_1.AppError('Access denied', 403);
        }
        next();
    }
    catch (error) {
        logger_1.logger.error('Partner access validation failed:', error);
        next(error);
    }
};
exports.validatePartnerAccess = validatePartnerAccess;
const validateApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                details: {
                    error: 'Missing API key',
                    path: req.path,
                },
            });
            throw new AppError_1.AppError('API key is required', 401);
        }
        const partner = await prisma.partner.findFirst({
            where: {
                apiKey: apiKey,
            },
        });
        if (!partner) {
            await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                details: {
                    error: 'Invalid API key',
                    path: req.path,
                },
            });
            throw new AppError_1.AppError('Invalid API key', 401);
        }
        // Attach partner to request
        req.partner = partner;
        // Log successful authentication
        await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
            partnerId: partner.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            details: {
                event: 'Authentication successful',
                path: req.path,
            },
        });
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateApiKey = validateApiKey;
