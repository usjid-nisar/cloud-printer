"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const AppError_1 = require("../utils/AppError");
const promises_1 = __importDefault(require("dns/promises"));
const prisma = new client_1.PrismaClient();
class DnsService {
    constructor() {
        this.baseDomain = process.env.BASE_DOMAIN || 'print.cloud';
        this.verificationInterval = 5 * 60 * 1000; // 5 minutes
        this.verificationTimers = new Map();
        this.baseDomain = process.env.BASE_DOMAIN || 'print.cloud';
    }
    async createDnsRecord(partnerId, domain) {
        try {
            const existingRecord = await prisma.dnsRecord.findFirst({
                where: {
                    partnerId,
                    name: domain,
                    type: 'CNAME',
                },
            });
            if (existingRecord) {
                throw new AppError_1.AppError('DNS record already exists for this domain', 409);
            }
            const dnsRecord = await prisma.dnsRecord.create({
                data: {
                    partnerId,
                    name: domain,
                    type: 'CNAME',
                    value: `${domain}.${this.baseDomain}`,
                    status: 'pending',
                },
            });
            // Start async DNS verification
            this.verifyDnsRecord(dnsRecord.id).catch(error => {
                logger_1.logger.error('DNS verification failed:', error);
            });
            return {
                record: dnsRecord,
                instructions: this.getDnsInstructions(domain),
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to create DNS record:', error);
            throw error;
        }
    }
    async verifyDnsRecord(recordId) {
        try {
            const record = await prisma.dnsRecord.findUnique({
                where: { id: recordId },
            });
            if (!record) {
                throw new AppError_1.AppError('DNS record not found', 404);
            }
            // Simulate DNS verification (replace with actual DNS lookup logic)
            const isValid = await this.performDnsLookup(record.name, record.value);
            await prisma.dnsRecord.update({
                where: { id: recordId },
                data: {
                    status: isValid ? 'active' : 'failed',
                    updatedAt: new Date(),
                },
            });
            return isValid;
        }
        catch (error) {
            logger_1.logger.error('Failed to verify DNS record:', error);
            throw error;
        }
    }
    async deleteDnsRecord(partnerId, domain) {
        try {
            const record = await prisma.dnsRecord.findFirst({
                where: {
                    partnerId,
                    name: domain,
                    type: 'CNAME',
                },
            });
            if (!record) {
                throw new AppError_1.AppError('DNS record not found', 404);
            }
            await prisma.dnsRecord.delete({
                where: { id: record.id },
            });
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Failed to delete DNS record:', error);
            throw error;
        }
    }
    getDnsInstructions(domain) {
        return {
            type: 'CNAME',
            host: domain,
            pointsTo: `${domain}.${this.baseDomain}`,
            ttl: 3600,
            steps: [
                'Log in to your domain registrar or DNS provider',
                'Navigate to the DNS management section',
                'Add a new CNAME record with the following values:',
                `- Host/Name: ${domain}`,
                `- Points to: ${domain}.${this.baseDomain}`,
                '- TTL: 3600 (or 1 hour)',
                'Save the changes and wait for DNS propagation (up to 48 hours)',
            ],
        };
    }
    async performDnsLookup(domain, expectedValue) {
        // TODO: Implement actual DNS lookup logic
        // For now, return true to simulate successful verification
        return true;
    }
    async startVerification(partnerId, domain) {
        // Clear any existing verification timer for this domain
        if (this.verificationTimers.has(domain)) {
            clearInterval(this.verificationTimers.get(domain));
        }
        const timer = setInterval(() => this.verifyDns(partnerId, domain), this.verificationInterval);
        this.verificationTimers.set(domain, timer);
        // Start first verification immediately
        this.verifyDns(partnerId, domain);
    }
    async verifyDns(partnerId, domain) {
        try {
            const dnsRecord = await prisma.dnsRecord.findFirst({
                where: {
                    partnerId,
                    name: domain,
                    type: 'CNAME',
                },
            });
            if (!dnsRecord) {
                this.stopVerification(domain);
                return;
            }
            const isValid = await this.checkDnsRecord(domain, dnsRecord.value);
            if (isValid) {
                await this.markDnsVerified(partnerId, domain);
                this.stopVerification(domain);
                logger_1.logger.info(`DNS verification successful for domain: ${domain}`);
            }
            else {
                logger_1.logger.warn(`DNS verification failed for domain: ${domain}`);
            }
        }
        catch (error) {
            logger_1.logger.error(`DNS verification error for domain ${domain}:`, error);
        }
    }
    async checkDnsRecord(domain, expectedValue) {
        try {
            const records = await promises_1.default.resolveCname(domain);
            return records.some(record => record === expectedValue);
        }
        catch (error) {
            logger_1.logger.error(`Failed to resolve CNAME for ${domain}:`, error);
            return false;
        }
    }
    async markDnsVerified(partnerId, domain) {
        await prisma.dnsRecord.updateMany({
            where: {
                partnerId,
                name: domain,
                type: 'CNAME',
            },
            data: {
                status: 'active',
            },
        });
        // Update partner's domain status if needed
        await prisma.partner.update({
            where: { id: partnerId },
            data: {
                domain: domain,
            },
        });
    }
    stopVerification(domain) {
        const timer = this.verificationTimers.get(domain);
        if (timer) {
            clearInterval(timer);
            this.verificationTimers.delete(domain);
        }
    }
    async getDnsStatus(partnerId, domain) {
        const record = await prisma.dnsRecord.findFirst({
            where: {
                partnerId,
                name: domain,
                type: 'CNAME',
            },
        });
        return {
            status: record?.status || 'not_found',
            value: record?.value,
            lastChecked: record?.updatedAt,
        };
    }
    async removeDnsRecord(partnerId, domain) {
        try {
            // Here you would typically integrate with your DNS provider's API
            // to remove the actual DNS record
            await prisma.dnsRecord.deleteMany({
                where: {
                    partnerId,
                    name: domain,
                },
            });
            this.stopVerification(domain);
            logger_1.logger.info(`Removed DNS records for domain: ${domain}`);
        }
        catch (error) {
            logger_1.logger.error('Failed to remove DNS record:', error);
            throw new AppError_1.AppError('Failed to remove DNS record', 500);
        }
    }
}
exports.DnsService = DnsService;
