import { z } from 'zod';

// Shared schemas
const colorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color code');
const urlSchema = z.string().url('Invalid URL');

// Branding data schema
const brandingDataSchema = z.object({
  logo: z.object({
    url: z.string().url(),
    width: z.number().min(1),
    height: z.number().min(1),
  }).optional(),
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    accent: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  }).optional(),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }).optional(),
  layout: z.object({
    headerStyle: z.enum(['minimal', 'standard', 'custom']),
    footerStyle: z.enum(['minimal', 'standard', 'custom']),
  }).optional(),
}).strict();

// Partner creation schema
export const createPartnerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  domain: z.string().url().optional(),
  selfProduce: z.boolean().optional(),
  brandingSettings: brandingDataSchema,
}).strict();

// Update branding schema
export const updateBrandingSchema = z.object({
  params: z.object({
    partnerId: z.string().uuid('Invalid partner ID'),
  }).strict(),
  body: z.object({
    brandingData: brandingDataSchema,
  }).strict(),
}).strict();

// Validate domain schema
export const validateDomainSchema = z.object({
  params: z.object({
    domain: z.string()
      .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 'Invalid domain format'),
  }).strict(),
  body: z.object({
    partnerId: z.string().uuid('Invalid partner ID'),
  }).strict(),
}).strict();

// API key rotation schema
export const rotateApiKeySchema = z.object({
  partnerId: z.string().uuid(),
}).strict();

// Get onboarding status schema
export const getOnboardingStatusSchema = z.object({
  params: z.object({
    partnerId: z.string().uuid('Invalid partner ID'),
  }).strict(),
}).strict();

// Validate API key schema
export const validateApiKeySchema = z.object({
  headers: z.object({
    'x-api-key': z.string().min(1, 'API key is required'),
  }).strict(),
}).strict();

// Partner update schema
export const updatePartnerSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  domain: z.string().url().optional(),
  selfProduce: z.boolean().optional(),
  brandingSettings: brandingDataSchema.optional(),
}).strict();

// DNS record validation schema
export const dnsRecordSchema = z.object({
  type: z.enum(['CNAME', 'A', 'TXT']),
  name: z.string(),
  value: z.string(),
}).strict(); 