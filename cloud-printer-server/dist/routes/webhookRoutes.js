"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRoutes = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const ShopifyService_1 = require("../plugins/shopify/ShopifyService");
const WooCommerceService_1 = require("../plugins/woocommerce/WooCommerceService");
const validateWebhookSignature_1 = require("../middleware/validateWebhookSignature");
const logger_1 = require("../utils/logger");
const AppError_1 = require("../utils/AppError");
const router = (0, express_1.Router)();
exports.webhookRoutes = router;
const prisma = new client_1.PrismaClient();
/**
 * @swagger
 * /v1/webhooks/shopify:
 *   post:
 *     summary: Handle Shopify webhooks
 *     tags: [Webhooks]
 *     security:
 *       - ShopifyHmac: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 */
router.post('/shopify', validateWebhookSignature_1.validateShopifyWebhook, async (req, res, next) => {
    try {
        const shopDomain = req.headers['x-shopify-shop-domain'];
        const topic = req.headers['x-shopify-topic'];
        logger_1.logger.info(`Received Shopify webhook: ${topic} from ${shopDomain}`);
        // Find partner by shop domain
        const partner = await prisma.partner.findFirst({
            where: {
                integrations: {
                    some: {
                        platform: 'shopify',
                        config: {
                            path: ['shopDomain'],
                            equals: shopDomain,
                        },
                    },
                },
            },
        });
        if (!partner) {
            throw new AppError_1.AppError(`No partner found for Shopify shop: ${shopDomain}`, 404);
        }
        const shopifyService = new ShopifyService_1.ShopifyService(partner.id);
        await shopifyService.initialize();
        // Process based on webhook topic
        switch (topic) {
            case 'orders/create':
                await shopifyService.processOrder(req.body);
                break;
            case 'orders/cancelled':
                await shopifyService.cancelOrder(req.body);
                break;
            default:
                logger_1.logger.warn(`Unhandled Shopify webhook topic: ${topic}`);
        }
        res.status(200).json({ status: 'success' });
    }
    catch (error) {
        logger_1.logger.error('Error processing Shopify webhook:', error);
        res.sendStatus(500);
    }
});
/**
 * @swagger
 * /v1/webhooks/woocommerce:
 *   post:
 *     summary: Handle WooCommerce webhooks
 *     tags: [Webhooks]
 *     security:
 *       - WooCommerceSignature: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 */
router.post('/woocommerce', validateWebhookSignature_1.validateWooCommerceWebhook, async (req, res, next) => {
    try {
        const topic = req.headers['x-wc-webhook-topic'];
        const source = req.headers['x-wc-webhook-source'];
        logger_1.logger.info(`Received WooCommerce webhook: ${topic} from ${source}`);
        // Find partner by WooCommerce site URL
        const partner = await prisma.partner.findFirst({
            where: {
                integrations: {
                    some: {
                        platform: 'woocommerce',
                        config: {
                            path: ['siteUrl'],
                            equals: source,
                        },
                    },
                },
            },
        });
        if (!partner) {
            throw new AppError_1.AppError(`No partner found for WooCommerce site: ${source}`, 404);
        }
        const wooCommerceService = new WooCommerceService_1.WooCommerceService(partner.id);
        await wooCommerceService.initialize();
        // Process based on webhook topic
        switch (topic) {
            case 'order.created':
                await wooCommerceService.processOrder(req.body);
                break;
            case 'order.cancelled':
                await wooCommerceService.cancelOrder(req.body);
                break;
            default:
                logger_1.logger.warn(`Unhandled WooCommerce webhook topic: ${topic}`);
        }
        res.status(200).json({ status: 'success' });
    }
    catch (error) {
        logger_1.logger.error('Error processing WooCommerce webhook:', error);
        res.sendStatus(500);
    }
});
