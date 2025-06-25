"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dnsRecordSchema = exports.updatePartnerSchema = exports.validateApiKeySchema = exports.getOnboardingStatusSchema = exports.rotateApiKeySchema = exports.validateDomainSchema = exports.updateBrandingSchema = exports.createPartnerSchema = void 0;
const zod_1 = require("zod");
// Shared schemas
const colorSchema = zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color code');
const urlSchema = zod_1.z.string().url('Invalid URL');
// Branding data schema
const brandingDataSchema = zod_1.z.object({
    logo: zod_1.z.object({
        url: zod_1.z.string().url(),
        width: zod_1.z.number().min(1),
        height: zod_1.z.number().min(1),
    }).optional(),
    colors: zod_1.z.object({
        primary: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i),
        secondary: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        accent: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    }).optional(),
    fonts: zod_1.z.object({
        heading: zod_1.z.string(),
        body: zod_1.z.string(),
    }).optional(),
    layout: zod_1.z.object({
        headerStyle: zod_1.z.enum(['minimal', 'standard', 'custom']),
        footerStyle: zod_1.z.enum(['minimal', 'standard', 'custom']),
    }).optional(),
}).strict();
// Partner creation schema
exports.createPartnerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    domain: zod_1.z.string().url().optional(),
    selfProduce: zod_1.z.boolean().optional(),
    brandingSettings: brandingDataSchema,
}).strict();
// Update branding schema
exports.updateBrandingSchema = zod_1.z.object({
    params: zod_1.z.object({
        partnerId: zod_1.z.string().uuid('Invalid partner ID'),
    }).strict(),
    body: zod_1.z.object({
        brandingData: brandingDataSchema,
    }).strict(),
}).strict();
// Validate domain schema
exports.validateDomainSchema = zod_1.z.object({
    params: zod_1.z.object({
        domain: zod_1.z.string()
            .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 'Invalid domain format'),
    }).strict(),
    body: zod_1.z.object({
        partnerId: zod_1.z.string().uuid('Invalid partner ID'),
    }).strict(),
}).strict();
// API key rotation schema
exports.rotateApiKeySchema = zod_1.z.object({
    partnerId: zod_1.z.string().uuid(),
}).strict();
// Get onboarding status schema
exports.getOnboardingStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        partnerId: zod_1.z.string().uuid('Invalid partner ID'),
    }).strict(),
}).strict();
// Validate API key schema
exports.validateApiKeySchema = zod_1.z.object({
    headers: zod_1.z.object({
        'x-api-key': zod_1.z.string().min(1, 'API key is required'),
    }).strict(),
}).strict();
// Partner update schema
exports.updatePartnerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    email: zod_1.z.string().email().optional(),
    domain: zod_1.z.string().url().optional(),
    selfProduce: zod_1.z.boolean().optional(),
    brandingSettings: brandingDataSchema.optional(),
}).strict();
// DNS record validation schema
exports.dnsRecordSchema = zod_1.z.object({
    type: zod_1.z.enum(['CNAME', 'A', 'TXT']),
    name: zod_1.z.string(),
    value: zod_1.z.string(),
}).strict();
