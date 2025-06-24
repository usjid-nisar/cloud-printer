import { z } from 'zod';

export const authValidators = {
  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8)
    })
  }),

  register: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8),
      role: z.enum(['admin', 'client']),
      partnerId: z.string().uuid().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional()
    })
  })
}; 