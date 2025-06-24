import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface WebhookConfig {
  webhookSecret: string;
  [key: string]: any;
}

export const validateShopifyWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const shopifyHmac = req.headers['x-shopify-hmac-sha256'];
    const shopifyShop = req.headers['x-shopify-shop-domain'];

    if (!shopifyHmac || !shopifyShop) {
      throw new AppError('Missing Shopify webhook headers', 401);
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
      throw new AppError('Invalid Shopify shop domain', 401);
    }

    const config = integration.config as WebhookConfig;
    const webhookSecret = config.webhookSecret;

    const body = JSON.stringify(req.body);
    const calculatedHmac = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('base64');

    if (calculatedHmac !== shopifyHmac) {
      throw new AppError('Invalid Shopify webhook signature', 401);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateWooCommerceWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['x-wc-webhook-signature'];
    const source = req.headers['x-wc-webhook-source'];

    if (!signature || !source) {
      throw new AppError('Missing WooCommerce webhook headers', 401);
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
      throw new AppError('Invalid WooCommerce site URL', 401);
    }

    const config = integration.config as WebhookConfig;
    const webhookSecret = config.webhookSecret;

    const body = JSON.stringify(req.body);
    const calculatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('base64');

    if (calculatedSignature !== signature) {
      throw new AppError('Invalid WooCommerce webhook signature', 401);
    }

    next();
  } catch (error) {
    next(error);
  }
}; 