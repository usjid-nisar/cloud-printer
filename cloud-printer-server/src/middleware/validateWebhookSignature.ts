import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppError } from '../utils/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Platform = 'shopify' | 'woocommerce';

export const validateWebhookSignature = (platform: Platform) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      switch (platform) {
        case 'shopify':
          await validateShopifyWebhook(req);
          break;
        case 'woocommerce':
          await validateWooCommerceWebhook(req);
          break;
        default:
          throw new AppError('Invalid platform', 400);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

async function validateShopifyWebhook(req: Request) {
  const signature = req.headers['x-shopify-hmac-sha256'];
  const shopDomain = req.headers['x-shopify-shop-domain'];

  if (!signature || !shopDomain) {
    throw new AppError('Missing Shopify webhook headers', 400);
  }

  // Get the webhook secret from the integration config
  const integration = await prisma.integration.findFirst({
    where: {
      platform: 'shopify',
      config: {
        path: ['shopDomain'],
        equals: shopDomain,
      },
    },
  });

  if (!integration) {
    throw new AppError('Integration not found', 404);
  }

  const webhookSecret = integration.config.webhookSecret;
  const body = JSON.stringify(req.body);
  
  const hmac = crypto
    .createHmac('sha256', webhookSecret)
    .update(body, 'utf8')
    .digest('base64');

  if (hmac !== signature) {
    throw new AppError('Invalid Shopify webhook signature', 401);
  }
}

async function validateWooCommerceWebhook(req: Request) {
  const signature = req.headers['x-wc-webhook-signature'];
  const sourceUrl = req.headers['x-wc-webhook-source'];

  if (!signature || !sourceUrl) {
    throw new AppError('Missing WooCommerce webhook headers', 400);
  }

  // Get the webhook secret from the integration config
  const integration = await prisma.integration.findFirst({
    where: {
      platform: 'woocommerce',
      config: {
        path: ['siteUrl'],
        equals: sourceUrl,
      },
    },
  });

  if (!integration) {
    throw new AppError('Integration not found', 404);
  }

  const webhookSecret = integration.config.webhookSecret;
  const body = req.body;

  const hmac = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(body))
    .digest('base64');

  if (hmac !== signature) {
    throw new AppError('Invalid WooCommerce webhook signature', 401);
  }
} 