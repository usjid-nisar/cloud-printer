"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardingController = void 0;
const onboardingService_1 = require("../services/onboardingService");
const auditService_1 = require("../services/auditService");
const logger_1 = require("../utils/logger");
const AppError_1 = require("../utils/AppError");
const onboardingService = new onboardingService_1.OnboardingService();
const auditService = new auditService_1.AuditService();
exports.onboardingController = {
    async createPartner(req, res, next) {
        try {
            const { name, email, domain, brandingData } = req.body;
            // Log onboarding attempt
            await auditService.logEvent(auditService_1.AuditEventType.PARTNER_CREATED, {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                details: {
                    name,
                    email,
                    domain,
                },
            });
            const partner = await onboardingService.createPartner({
                name,
                email,
                domain,
                brandingData,
            });
            // Log successful onboarding
            await auditService.logEvent(auditService_1.AuditEventType.PARTNER_UPDATED, {
                partnerId: partner.id,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                details: {
                    name,
                    email,
                    domain,
                },
            });
            res.status(201).json({
                message: 'Partner created successfully',
                data: {
                    partnerId: partner.id,
                    apiKey: partner.apiKey, // This will be shown only once
                    name: partner.name,
                    email: partner.email,
                    domain: partner.domain,
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Partner creation failed:', error);
            next(error);
        }
    },
    async validateDomain(req, res, next) {
        try {
            const { domain } = req.params;
            const { partnerId } = req.body;
            const dnsStatus = await onboardingService.getDnsStatus(partnerId, domain);
            res.json({
                status: dnsStatus.status,
                message: dnsStatus.message,
                details: dnsStatus.details,
            });
        }
        catch (error) {
            logger_1.logger.error('Domain validation failed:', error);
            next(error);
        }
    },
    async updateBranding(req, res, next) {
        try {
            const { partnerId } = req.params;
            const { brandingData } = req.body;
            const updatedTheme = await onboardingService.updateBranding(partnerId, brandingData);
            await auditService.logEvent(auditService_1.AuditEventType.BRANDING_UPDATED, {
                partnerId,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                details: {
                    brandingData,
                },
            });
            res.json({
                message: 'Branding updated successfully',
                data: updatedTheme,
            });
        }
        catch (error) {
            logger_1.logger.error('Branding update failed:', error);
            next(error);
        }
    },
    async rotateApiKey(req, res, next) {
        try {
            const { partnerId } = req.params;
            const newApiKey = await onboardingService.rotateApiKey(partnerId);
            await auditService.logEvent(auditService_1.AuditEventType.API_KEY_ROTATED, {
                partnerId,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                details: {
                    timestamp: new Date(),
                },
            });
            res.json({
                message: 'API key rotated successfully',
                data: {
                    apiKey: newApiKey.apiKey, // New API key shown only once
                },
            });
        }
        catch (error) {
            logger_1.logger.error('API key rotation failed:', error);
            next(error);
        }
    },
    async validateApiKey(req, res, next) {
        try {
            const apiKey = req.headers['x-api-key'];
            if (!apiKey) {
                throw new AppError_1.AppError('API key is required', 401);
            }
            const isValid = await onboardingService.validateApiKey(apiKey);
            if (!isValid) {
                await auditService.logEvent(auditService_1.AuditEventType.SECURITY_EVENT, {
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                    details: {
                        event: 'api_key_validation_failed',
                        timestamp: new Date(),
                    },
                });
                throw new AppError_1.AppError('Invalid API key', 401);
            }
            res.json({
                valid: true,
                message: 'API key is valid',
            });
        }
        catch (error) {
            logger_1.logger.error('API key validation failed:', error);
            next(error);
        }
    },
    async getOnboardingStatus(req, res, next) {
        try {
            const { partnerId } = req.params;
            const status = await onboardingService.getOnboardingStatus(partnerId);
            res.json({
                status: status.status,
                completedSteps: status.completedSteps,
                pendingSteps: status.pendingSteps,
                details: status.details,
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to get onboarding status:', error);
            next(error);
        }
    },
};
