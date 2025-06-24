import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ShopifyService } from '../plugins/shopify/ShopifyService';
import { WooCommerceService } from '../plugins/woocommerce/WooCommerceService';
import { validateShopifyWebhook, validateWooCommerceWebhook } from '../middleware/validateWebhookSignature';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

const router = Router();
const prisma = new PrismaClient();

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
router.post('/shopify',
  validateShopifyWebhook,
  async (req, res, next) => {
    try {
      const shopDomain = req.headers['x-shopify-shop-domain'] as string;
      const topic = req.headers['x-shopify-topic'] as string;

      logger.info(`Received Shopify webhook: ${topic} from ${shopDomain}`);

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
        throw new AppError(`No partner found for Shopify shop: ${shopDomain}`, 404);
      }

      const shopifyService = new ShopifyService(partner.id);
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
          logger.warn(`Unhandled Shopify webhook topic: ${topic}`);
      }

      res.status(200).json({ status: 'success' });
    } catch (error) {
      logger.error('Error processing Shopify webhook:', error);
      res.sendStatus(500);
    }
  }
);

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
router.post('/woocommerce',
  validateWooCommerceWebhook,
  async (req, res, next) => {
    try {
      const topic = req.headers['x-wc-webhook-topic'] as string;
      const source = req.headers['x-wc-webhook-source'] as string;

      logger.info(`Received WooCommerce webhook: ${topic} from ${source}`);

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
        throw new AppError(`No partner found for WooCommerce site: ${source}`, 404);
      }

      const wooCommerceService = new WooCommerceService(partner.id);
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
          logger.warn(`Unhandled WooCommerce webhook topic: ${topic}`);
      }

      res.status(200).json({ status: 'success' });
    } catch (error) {
      logger.error('Error processing WooCommerce webhook:', error);
      res.sendStatus(500);
    }
  }
);

export { router as webhookRoutes }; 