import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    body: z.ZodObject<{
        orderNumber: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            quantity: z.ZodNumber;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            productId: string;
            quantity: number;
            metadata?: Record<string, any> | undefined;
        }, {
            productId: string;
            quantity: number;
            metadata?: Record<string, any> | undefined;
        }>, "many">;
        customerData: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
            address: z.ZodObject<{
                street: z.ZodString;
                city: z.ZodString;
                state: z.ZodString;
                postalCode: z.ZodString;
                country: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
            }, {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            email: string;
            address: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
            };
        }, {
            name: string;
            email: string;
            address: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        orderNumber: string;
        items: {
            productId: string;
            quantity: number;
            metadata?: Record<string, any> | undefined;
        }[];
        customerData: {
            name: string;
            email: string;
            address: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
            };
        };
    }, {
        orderNumber: string;
        items: {
            productId: string;
            quantity: number;
            metadata?: Record<string, any> | undefined;
        }[];
        customerData: {
            name: string;
            email: string;
            address: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
            };
        };
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        orderNumber: string;
        items: {
            productId: string;
            quantity: number;
            metadata?: Record<string, any> | undefined;
        }[];
        customerData: {
            name: string;
            email: string;
            address: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
            };
        };
    };
}, {
    body: {
        orderNumber: string;
        items: {
            productId: string;
            quantity: number;
            metadata?: Record<string, any> | undefined;
        }[];
        customerData: {
            name: string;
            email: string;
            address: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
            };
        };
    };
}>;
export declare const updateOrderSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodEnum<["pending", "processing", "shipped", "delivered", "cancelled"]>;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    }, {
        status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    }>;
    params: z.ZodObject<{
        orderId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
    }, {
        orderId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        orderId: string;
    };
    body: {
        status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    };
}, {
    params: {
        orderId: string;
    };
    body: {
        status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    };
}>;
