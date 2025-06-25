import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';
import dns from 'dns/promises';

const prisma = new PrismaClient();

export interface DnsRecordResponse {
  record: {
    id: string;
    partnerId: string;
    name: string;
    type: string;
    value: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
  instructions: {
    type: string;
    host: string;
    pointsTo: string;
    ttl: number;
    steps: string[];
  };
}

export class DnsService {
  private readonly baseDomain = process.env.BASE_DOMAIN || 'print.cloud';
  private readonly verificationInterval = 5 * 60 * 1000; // 5 minutes
  private verificationTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.baseDomain = process.env.BASE_DOMAIN || 'print.cloud';
  }

  async createDnsRecord(partnerId: string, domain: string): Promise<DnsRecordResponse> {
    try {
      const existingRecord = await prisma.dnsRecord.findFirst({
        where: {
          partnerId,
          name: domain,
          type: 'CNAME',
        },
      });

      if (existingRecord) {
        throw new AppError('DNS record already exists for this domain', 409);
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
        logger.error('DNS verification failed:', error);
      });

      return {
        record: dnsRecord,
        instructions: this.getDnsInstructions(domain),
      };
    } catch (error) {
      logger.error('Failed to create DNS record:', error);
      throw error;
    }
  }

  async verifyDnsRecord(recordId: string) {
    try {
      const record = await prisma.dnsRecord.findUnique({
        where: { id: recordId },
      });

      if (!record) {
        throw new AppError('DNS record not found', 404);
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
    } catch (error) {
      logger.error('Failed to verify DNS record:', error);
      throw error;
    }
  }

  async deleteDnsRecord(partnerId: string, domain: string) {
    try {
      const record = await prisma.dnsRecord.findFirst({
        where: {
          partnerId,
          name: domain,
          type: 'CNAME',
        },
      });

      if (!record) {
        throw new AppError('DNS record not found', 404);
      }

      await prisma.dnsRecord.delete({
        where: { id: record.id },
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to delete DNS record:', error);
      throw error;
    }
  }

  private getDnsInstructions(domain: string) {
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

  private async performDnsLookup(domain: string, expectedValue: string): Promise<boolean> {
    // TODO: Implement actual DNS lookup logic
    // For now, return true to simulate successful verification
    return true;
  }

  async startVerification(partnerId: string, domain: string) {
    // Clear any existing verification timer for this domain
    if (this.verificationTimers.has(domain)) {
      clearInterval(this.verificationTimers.get(domain));
    }

    const timer = setInterval(
      () => this.verifyDns(partnerId, domain),
      this.verificationInterval
    );

    this.verificationTimers.set(domain, timer);

    // Start first verification immediately
    this.verifyDns(partnerId, domain);
  }

  private async verifyDns(partnerId: string, domain: string) {
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
        logger.info(`DNS verification successful for domain: ${domain}`);
      } else {
        logger.warn(`DNS verification failed for domain: ${domain}`);
      }
    } catch (error) {
      logger.error(`DNS verification error for domain ${domain}:`, error);
    }
  }

  private async checkDnsRecord(domain: string, expectedValue: string): Promise<boolean> {
    try {
      const records = await dns.resolveCname(domain);
      return records.some(record => record === expectedValue);
    } catch (error) {
      logger.error(`Failed to resolve CNAME for ${domain}:`, error);
      return false;
    }
  }

  private async markDnsVerified(partnerId: string, domain: string) {
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

  private stopVerification(domain: string) {
    const timer = this.verificationTimers.get(domain);
    if (timer) {
      clearInterval(timer);
      this.verificationTimers.delete(domain);
    }
  }

  async getDnsStatus(partnerId: string, domain: string) {
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

  async removeDnsRecord(partnerId: string, domain: string) {
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

      logger.info(`Removed DNS records for domain: ${domain}`);
    } catch (error) {
      logger.error('Failed to remove DNS record:', error);
      throw new AppError('Failed to remove DNS record', 500);
    }
  }
} 