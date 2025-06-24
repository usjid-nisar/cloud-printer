export declare enum AuditEventType {
    PARTNER_CREATED = "PARTNER_CREATED",
    PARTNER_UPDATED = "PARTNER_UPDATED",
    API_KEY_GENERATED = "API_KEY_GENERATED",
    API_KEY_ROTATED = "API_KEY_ROTATED",
    DNS_RECORD_CREATED = "DNS_RECORD_CREATED",
    DNS_RECORD_VERIFIED = "DNS_RECORD_VERIFIED",
    DNS_RECORD_FAILED = "DNS_RECORD_FAILED",
    DNS_RECORD_DELETED = "DNS_RECORD_DELETED",
    BRANDING_UPDATED = "BRANDING_UPDATED",
    SECURITY_EVENT = "SECURITY_EVENT"
}
interface AuditEventData {
    partnerId?: string;
    ipAddress?: string;
    userAgent?: string;
    details: Record<string, any>;
}
export declare class AuditService {
    logEvent(eventType: AuditEventType, data: AuditEventData): Promise<{
        details: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        partnerId: string | null;
        createdAt: Date;
        eventType: string;
        ipAddress: string | null;
        userAgent: string | null;
    } | undefined>;
    getAuditLogs(params: {
        partnerId?: string;
        eventType?: AuditEventType;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        logs: {
            details: import("@prisma/client/runtime/library").JsonValue;
            id: string;
            partnerId: string | null;
            createdAt: Date;
            eventType: string;
            ipAddress: string | null;
            userAgent: string | null;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSecurityEvents(partnerId: string, startDate?: Date, endDate?: Date): Promise<{
        totalEvents: number;
        byStatus: Record<string, number>;
        byAction: Record<string, number>;
        byIpAddress: Record<string, number>;
        recentEvents: any[];
        summary: string;
    }>;
    private analyzeSecurityEvents;
    cleanupOldLogs(retentionDays: number): Promise<number>;
    getAuditSummary(partnerId: string): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AuditLogGroupByOutputType, "eventType"[]> & {
        _count: number;
    })[]>;
}
export {};
