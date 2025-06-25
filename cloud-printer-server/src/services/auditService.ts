import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export enum AuditEventType {
  PARTNER_CREATED = 'PARTNER_CREATED',
  PARTNER_UPDATED = 'PARTNER_UPDATED',
  API_KEY_GENERATED = 'API_KEY_GENERATED',
  API_KEY_ROTATED = 'API_KEY_ROTATED',
  DNS_RECORD_CREATED = 'DNS_RECORD_CREATED',
  DNS_RECORD_VERIFIED = 'DNS_RECORD_VERIFIED',
  DNS_RECORD_FAILED = 'DNS_RECORD_FAILED',
  DNS_RECORD_DELETED = 'DNS_RECORD_DELETED',
  BRANDING_UPDATED = 'BRANDING_UPDATED',
  SECURITY_EVENT = 'SECURITY_EVENT',
}

interface AuditEventData {
  partnerId?: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, any>;
}

export class AuditService {
  async logEvent(eventType: AuditEventType, data: AuditEventData) {
    try {
      const auditLog = await prisma.auditLog.create({
        data: {
          eventType,
          partnerId: data.partnerId,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          details: data.details,
        },
      });

      logger.info('Audit log created:', {
        eventType,
        partnerId: data.partnerId,
      });

      return auditLog;
    } catch (error) {
      logger.error('Failed to create audit log:', error);
      // Don't throw error to prevent disrupting the main flow
      // Just log the error and continue
    }
  }

  async getAuditLogs(params: {
    partnerId?: string;
    eventType?: AuditEventType;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        partnerId,
        eventType,
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = params;

      const where: any = {};

      if (partnerId) {
        where.partnerId = partnerId;
      }

      if (eventType) {
        where.eventType = eventType;
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          where.createdAt.gte = startDate;
        }
        if (endDate) {
          where.createdAt.lte = endDate;
        }
      }

      const [total, logs] = await Promise.all([
        prisma.auditLog.count({ where }),
        prisma.auditLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return {
        logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Failed to get audit logs:', error);
      throw error;
    }
  }

  async getSecurityEvents(partnerId: string, startDate?: Date, endDate?: Date) {
    try {
      const where: any = {
        partnerId,
        eventType: AuditEventType.SECURITY_EVENT,
      };

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          where.createdAt.gte = startDate;
        }
        if (endDate) {
          where.createdAt.lte = endDate;
        }
      }

      const events = await prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return this.analyzeSecurityEvents(events);
    } catch (error) {
      logger.error('Failed to get security events:', error);
      throw error;
    }
  }

  private analyzeSecurityEvents(events: any[]) {
    const analysis = {
      totalEvents: events.length,
      byStatus: {} as Record<string, number>,
      byAction: {} as Record<string, number>,
      byIpAddress: {} as Record<string, number>,
      recentEvents: events.slice(0, 10),
      summary: '',
    };

    events.forEach(event => {
      // Count by status
      if (event.details.status) {
        analysis.byStatus[event.details.status] = (analysis.byStatus[event.details.status] || 0) + 1;
      }

      // Count by action
      if (event.details.action) {
        analysis.byAction[event.details.action] = (analysis.byAction[event.details.action] || 0) + 1;
      }

      // Count by IP address
      if (event.ipAddress) {
        analysis.byIpAddress[event.ipAddress] = (analysis.byIpAddress[event.ipAddress] || 0) + 1;
      }
    });

    // Generate summary
    const failedAttempts = analysis.byStatus['failed'] || 0;
    const suspiciousIps = Object.entries(analysis.byIpAddress)
      .filter(([_, count]) => count > 10)
      .length;

    analysis.summary = `Found ${analysis.totalEvents} security events. ` +
      `${failedAttempts} failed attempts. ` +
      `${suspiciousIps} suspicious IP addresses detected.`;

    return analysis;
  }

  async cleanupOldLogs(retentionDays: number) {
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - retentionDays);

    try {
      const { count } = await prisma.auditLog.deleteMany({
        where: {
          createdAt: {
            lt: retentionDate,
          },
        },
      });

      logger.info(`Cleaned up ${count} old audit logs`);
      return count;
    } catch (error) {
      logger.error('Failed to cleanup old audit logs:', error);
      throw error;
    }
  }

  async getAuditSummary(partnerId: string) {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      const summary = await prisma.auditLog.groupBy({
        by: ['eventType'],
        where: {
          partnerId,
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        _count: true,
      });

      return summary;
    } catch (error) {
      logger.error('Failed to generate audit summary:', error);
      throw error;
    }
  }
} 