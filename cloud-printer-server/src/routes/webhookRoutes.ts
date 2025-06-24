import { Router } from 'express';
import { ShopifyService } from '../plugins/shopify/ShopifyService';
import { WooCommerceService } from '../plugins/woocommerce/WooCommerceService';
import { validateWebhookSignature } from '../middleware/validateWebhookSignature';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

const router = Router();

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
  validateWebhookSignature('shopify'),
  async (req, res, next) => {
    try {
      const topic = req.headers['x-shopify-topic'] as string;
      const shopId = req.headers['x-shopify-shop-domain'] as string;

      logger.info(`Received Shopify webhook: ${topic} from ${shopId}`);

      // Find partner by shop domain
      const partner = await prisma.partner.findFirst({
        where: {
          integrations: {
            some: {
              platform: 'shopify',
              config: {
                path: ['shopDomain'],
                equals: shopId,
              },
            },
          },
        },
      });

      if (!partner) {
        throw new AppError(`No partner found for Shopify shop: ${shopId}`, 404);
      }

      const shopifyService = new ShopifyService(partner.id);
      await shopifyService.initialize();
      await shopifyService.handleWebhook(topic, req.body);

      res.status(200).json({ status: 'success' });
    } catch (error) {
      next(error);
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
  validateWebhookSignature('woocommerce'),
  async (req, res, next) => {
    try {
      const topic = req.headers['x-wc-webhook-topic'] as string;
      const sourceUrl = req.headers['x-wc-webhook-source'] as string;

      logger.info(`Received WooCommerce webhook: ${topic} from ${sourceUrl}`);

      // Find partner by WooCommerce site URL
      const partner = await prisma.partner.findFirst({
        where: {
          integrations: {
            some: {
              platform: 'woocommerce',
              config: {
                path: ['siteUrl'],
                equals: sourceUrl,
              },
            },
          },
        },
      });

      if (!partner) {
        throw new AppError(`No partner found for WooCommerce site: ${sourceUrl}`, 404);
      }

      const wooCommerceService = new WooCommerceService(partner.id);
      await wooCommerceService.initialize();
      await wooCommerceService.handleWebhook(topic, req.body);

      res.status(200).json({ status: 'success' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as webhookRoutes }; 