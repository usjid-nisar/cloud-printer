"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWooCommerceWebhook = exports.validateShopifyWebhook = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
const validateShopifyWebhook = async (req, res, next) => {
    try {
        const shopifyHmac = req.headers['x-shopify-hmac-sha256'];
        const shopifyShop = req.headers['x-shopify-shop-domain'];
        if (!shopifyHmac || !shopifyShop) {
            throw new AppError_1.AppError('Missing Shopify webhook headers', 401);
        }
        const integration = await prisma.integration.findFirst({
            where: {
                platform: 'shopify',
                config: {
                    path: ['shopDomain'],
                    equals: shopifyShop,
                },
            },
        });
        if (!integration || !integration.config) {
            throw new AppError_1.AppError('Invalid Shopify shop domain', 401);
        }
        const config = integration.config;
        const webhookSecret = config.webhookSecret;
        const body = JSON.stringify(req.body);
        const calculatedHmac = crypto_1.default
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('base64');
        if (calculatedHmac !== shopifyHmac) {
            throw new AppError_1.AppError('Invalid Shopify webhook signature', 401);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateShopifyWebhook = validateShopifyWebhook;
const validateWooCommerceWebhook = async (req, res, next) => {
    try {
        const signature = req.headers['x-wc-webhook-signature'];
        const source = req.headers['x-wc-webhook-source'];
        if (!signature || !source) {
            throw new AppError_1.AppError('Missing WooCommerce webhook headers', 401);
        }
        const integration = await prisma.integration.findFirst({
            where: {
                platform: 'woocommerce',
                config: {
                    path: ['siteUrl'],
                    equals: source,
                },
            },
        });
        if (!integration || !integration.config) {
            throw new AppError_1.AppError('Invalid WooCommerce site URL', 401);
        }
        const config = integration.config;
        const webhookSecret = config.webhookSecret;
        const body = JSON.stringify(req.body);
        const calculatedSignature = crypto_1.default
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('base64');
        if (calculatedSignature !== signature) {
            throw new AppError_1.AppError('Invalid WooCommerce webhook signature', 401);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateWooCommerceWebhook = validateWooCommerceWebhook;
