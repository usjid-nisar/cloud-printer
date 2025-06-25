"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderNumber: zod_1.z.string().min(1),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            quantity: zod_1.z.number().int().positive(),
            metadata: zod_1.z.record(zod_1.z.any()).optional(),
        })),
        customerData: zod_1.z.object({
            name: zod_1.z.string(),
            email: zod_1.z.string().email(),
            address: zod_1.z.object({
                street: zod_1.z.string(),
                city: zod_1.z.string(),
                state: zod_1.z.string(),
                postalCode: zod_1.z.string(),
                country: zod_1.z.string(),
            }),
        }),
    }),
});
exports.updateOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
        ]),
    }),
    params: zod_1.z.object({
        orderId: zod_1.z.string().uuid(),
    }),
});
