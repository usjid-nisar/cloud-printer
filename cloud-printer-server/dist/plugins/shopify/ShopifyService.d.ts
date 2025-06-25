export declare class ShopifyService {
    private partnerId;
    constructor(partnerId: string);
    initialize(): Promise<void>;
    processOrder(orderData: any): Promise<{
        id: string;
        partnerId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        orderNumber: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        customerData: import("@prisma/client/runtime/library").JsonValue;
        source: string;
        sourceOrderId: string | null;
        routingAttempts: number;
        routedTo: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    cancelOrder(orderData: any): Promise<void>;
}
