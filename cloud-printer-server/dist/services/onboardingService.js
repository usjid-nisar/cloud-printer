"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingService = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const logger_1 = require("../utils/logger");
const AppError_1 = require("../utils/AppError");
const dnsService_1 = require("./dnsService");
const brandingService_1 = require("./brandingService");
const auditService_1 = require("./auditService");
const prisma = new client_1.PrismaClient();
class OnboardingService {
    constructor() {
        this.dnsService = new dnsService_1.DnsService();
        this.brandingService = new brandingService_1.BrandingService();
        this.auditService = new auditService_1.AuditService();
    }
    async createPartner(data) {
        const apiKey = this.generateApiKey();
        const apiKeyHash = this.hashApiKey(apiKey);
        try {
            // Create partner record
            const partner = await prisma.partner.create({
                data: {
                    name: data.name,
                    email: data.email,
                    domain: data.domain,
                    apiKey: apiKeyHash, // Store hashed version
                    apiKeyHash, // Store separately for verification
                    brandingSettings: data.brandingData || {},
                    selfProduce: false,
                },
            });
            // Initialize routing settings
            await prisma.routingSettings.create({
                data: {
                    partnerId: partner.id,
                    maxRetries: 3,
                    alertEmail: data.email,
                },
            });
            // If domain is provided, setup DNS
            if (data.domain) {
                await this.setupDns(partner.id, data.domain);
            }
            // If branding data is provided, generate theme
            if (data.brandingData) {
                await this.setupBranding(partner.id, data.brandingData);
            }
            // Log the partner creation
            await this.auditService.logEvent(auditService_1.AuditEventType.PARTNER_CREATED, {
                partnerId: partner.id,
                details: {
                    name: data.name,
                    email: data.email,
                    domain: data.domain,
                },
            });
            // Return partner info with plain text API key
            return {
                ...partner,
                apiKey, // Return the original API key
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to create partner:', error);
            throw new AppError_1.AppError('Failed to create partner', 500);
        }
    }
    async setupDns(partnerId, domain) {
        try {
            // Create CNAME record
            const dnsRecord = await this.dnsService.createDnsRecord(partnerId, domain);
            await prisma.dnsRecord.create({
                data: {
                    partnerId,
                    type: 'CNAME',
                    name: domain,
                    value: dnsRecord.record.value,
                    status: 'pending',
                },
            });
            // Start DNS verification process
            this.dnsService.startVerification(partnerId, domain);
        }
        catch (error) {
            logger_1.logger.error('Failed to setup DNS:', error);
            throw new AppError_1.AppError('Failed to setup DNS', 500);
        }
    }
    async setupBranding(partnerId, brandingData) {
        try {
            const themeJson = await this.brandingService.generateTheme(brandingData);
            await prisma.partner.update({
                where: { id: partnerId },
                data: {
                    brandingSettings: JSON.parse(JSON.stringify(themeJson)),
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to setup branding:', error);
            throw new AppError_1.AppError('Failed to setup branding', 500);
        }
    }
    async rotateApiKey(partnerId) {
        try {
            const newApiKey = this.generateApiKey();
            const newApiKeyHash = this.hashApiKey(newApiKey);
            await prisma.partner.update({
                where: { id: partnerId },
                data: {
                    apiKey: newApiKeyHash,
                    apiKeyHash: newApiKeyHash,
                },
            });
            await this.auditService.logEvent(auditService_1.AuditEventType.API_KEY_ROTATED, {
                partnerId,
                details: {
                    timestamp: new Date(),
                },
            });
            return { apiKey: newApiKey };
        }
        catch (error) {
            logger_1.logger.error('Failed to rotate API key:', error);
            throw new AppError_1.AppError('Failed to rotate API key', 500);
        }
    }
    async validateApiKey(apiKey) {
        const hashedKey = this.hashApiKey(apiKey);
        const partner = await prisma.partner.findUnique({
            where: { apiKey: hashedKey },
        });
        return !!partner;
    }
    generateApiKey() {
        return `cp_${(0, crypto_1.randomBytes)(32).toString('hex')}`;
    }
    hashApiKey(apiKey) {
        return (0, crypto_1.createHash)('sha256').update(apiKey).digest('hex');
    }
    async getDnsStatus(partnerId, domain) {
        try {
            const dnsRecord = await prisma.dnsRecord.findFirst({
                where: {
                    partnerId,
                    name: domain,
                    type: 'CNAME',
                },
            });
            if (!dnsRecord) {
                return {
                    status: 'not_found',
                    message: 'DNS record not found',
                    details: null,
                };
            }
            return {
                status: dnsRecord.status,
                message: this.getDnsStatusMessage(dnsRecord.status),
                details: {
                    value: dnsRecord.value,
                    lastChecked: dnsRecord.updatedAt,
                },
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to get DNS status:', error);
            throw new AppError_1.AppError('Failed to get DNS status', 500);
        }
    }
    async updateBranding(partnerId, brandingData) {
        try {
            const partner = await prisma.partner.findUnique({
                where: { id: partnerId },
            });
            if (!partner) {
                throw new AppError_1.AppError('Partner not found', 404);
            }
            const themeJson = await this.brandingService.generateTheme(brandingData);
            const updatedPartner = await prisma.partner.update({
                where: { id: partnerId },
                data: {
                    brandingSettings: JSON.parse(JSON.stringify(themeJson)),
                },
            });
            return {
                theme: themeJson,
                updatedAt: updatedPartner.updatedAt,
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to update branding:', error);
            throw error;
        }
    }
    async getOnboardingStatus(partnerId) {
        try {
            const [partner, dnsRecords] = await Promise.all([
                prisma.partner.findUnique({
                    where: { id: partnerId },
                }),
                prisma.dnsRecord.findMany({
                    where: { partnerId },
                }),
            ]);
            if (!partner) {
                throw new AppError_1.AppError('Partner not found', 404);
            }
            const completedSteps = [];
            const pendingSteps = [];
            // Check basic info
            if (partner.name && partner.email) {
                completedSteps.push('basic_info');
            }
            else {
                pendingSteps.push('basic_info');
            }
            // Check domain setup
            if (dnsRecords.some(record => record.status === 'active')) {
                completedSteps.push('domain_setup');
            }
            else {
                pendingSteps.push('domain_setup');
            }
            // Check branding
            if (partner.brandingSettings) {
                completedSteps.push('branding');
            }
            else {
                pendingSteps.push('branding');
            }
            return {
                status: pendingSteps.length === 0 ? 'completed' : 'in_progress',
                completedSteps,
                pendingSteps,
                details: {
                    domain: partner.domain,
                    brandingConfigured: !!partner.brandingSettings,
                    lastUpdated: partner.updatedAt,
                },
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to get onboarding status:', error);
            throw error;
        }
    }
    getDnsStatusMessage(status) {
        switch (status) {
            case 'pending':
                return 'DNS verification in progress';
            case 'active':
                return 'DNS verification successful';
            case 'failed':
                return 'DNS verification failed';
            default:
                return 'Unknown DNS status';
        }
    }
}
exports.OnboardingService = OnboardingService;
