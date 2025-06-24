import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    orderNumber: z.string().min(1),
    items: z.array(z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      metadata: z.record(z.any()).optional(),
    })),
    customerData: z.object({
      name: z.string(),
      email: z.string().email(),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        country: z.string(),
      }),
    }),
  }),
});

export const updateOrderSchema = z.object({
  body: z.object({
    status: z.enum([
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ]),
  }),
  params: z.object({
    orderId: z.string().uuid(),
  }),
}); 