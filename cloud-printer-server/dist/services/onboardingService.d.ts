import { BrandingTheme } from './brandingService';
export declare class OnboardingService {
    private dnsService;
    private brandingService;
    private auditService;
    constructor();
    createPartner(data: {
        name: string;
        email: string;
        domain?: string;
        brandingData?: any;
    }): Promise<{
        apiKey: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        apiKeyHash: string;
        domain: string | null;
        brandingSettings: import("@prisma/client/runtime/library").JsonValue | null;
        webhookUrl: string | null;
        selfProduce: boolean;
    }>;
    setupDns(partnerId: string, domain: string): Promise<void>;
    setupBranding(partnerId: string, brandingData: any): Promise<void>;
    rotateApiKey(partnerId: string): Promise<{
        apiKey: string;
    }>;
    validateApiKey(apiKey: string): Promise<boolean>;
    private generateApiKey;
    private hashApiKey;
    getDnsStatus(partnerId: string, domain: string): Promise<{
        status: string;
        message: string;
        details: null;
    } | {
        status: string;
        message: string;
        details: {
            value: string;
            lastChecked: Date;
        };
    }>;
    updateBranding(partnerId: string, brandingData: any): Promise<{
        theme: BrandingTheme;
        updatedAt: Date;
    }>;
    getOnboardingStatus(partnerId: string): Promise<{
        status: string;
        completedSteps: string[];
        pendingSteps: string[];
        details: {
            domain: string | null;
            brandingConfigured: boolean;
            lastUpdated: Date;
        };
    }>;
    private getDnsStatusMessage;
}
