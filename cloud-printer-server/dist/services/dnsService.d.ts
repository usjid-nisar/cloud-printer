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
export declare class DnsService {
    private readonly baseDomain;
    private readonly verificationInterval;
    private verificationTimers;
    constructor();
    createDnsRecord(partnerId: string, domain: string): Promise<DnsRecordResponse>;
    verifyDnsRecord(recordId: string): Promise<boolean>;
    deleteDnsRecord(partnerId: string, domain: string): Promise<{
        success: boolean;
    }>;
    private getDnsInstructions;
    private performDnsLookup;
    startVerification(partnerId: string, domain: string): Promise<void>;
    private verifyDns;
    private checkDnsRecord;
    private markDnsVerified;
    private stopVerification;
    getDnsStatus(partnerId: string, domain: string): Promise<{
        status: string;
        value: string | undefined;
        lastChecked: Date | undefined;
    }>;
    removeDnsRecord(partnerId: string, domain: string): Promise<void>;
}
