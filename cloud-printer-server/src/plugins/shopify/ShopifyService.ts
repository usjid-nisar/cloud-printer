import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';

const prisma = new PrismaClient();

export class ShopifyService {
  private partnerId: string;
  private shopifyConfig: any;

  constructor(partnerId: string) {
    this.partnerId = partnerId;
  }

  async initialize() {
    const integration = await prisma.integration.findUnique({
      where: {
        partnerId_platform: {
          partnerId: this.partnerId,
          platform: 'shopify',
        },
      },
    });

    if (!integration) {
      throw new AppError('Shopify integration not found', 404);
    }

    this.shopifyConfig = integration.config;
  }

  async handleWebhook(topic: string, payload: any) {
    logger.info(`Processing Shopify webhook: ${topic}`, {
      partnerId: this.partnerId,
      topic,
    });

    switch (topic) {
      case 'orders/create':
        return this.handleOrderCreated(payload);
      case 'orders/updated':
        return this.handleOrderUpdated(payload);
      case 'orders/cancelled':
        return this.handleOrderCancelled(payload);
      default:
        logger.warn(`Unhandled Shopify webhook topic: ${topic}`);
        return null;
    }
  }

  private async handleOrderCreated(payload: any) {
    try {
      const orderData = this.transformShopifyOrder(payload);
      
      const order = await prisma.order.create({
        data: {
          partnerId: this.partnerId,
          orderNumber: payload.order_number,
          status: 'pending',
          items: orderData.items,
          customerData: orderData.customerData,
          metadata: {
            shopifyOrderId: payload.id,
            source: 'shopify',
          },
        },
      });

      logger.info(`Created order from Shopify webhook: ${order.id}`);
      return order;
    } catch (error) {
      logger.error('Failed to process Shopify order creation', error);
      throw new AppError('Failed to process Shopify order', 500, error);
    }
  }

  private async handleOrderUpdated(payload: any) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          partnerId: this.partnerId,
          metadata: {
            path: ['shopifyOrderId'],
            equals: payload.id,
          },
        },
      });

      if (!order) {
        logger.warn(`Order not found for Shopify update: ${payload.id}`);
        return null;
      }

      // Update order status based on Shopify fulfillment status
      const status = this.mapShopifyStatus(payload.fulfillment_status);
      
      await prisma.order.update({
        where: { id: order.id },
        data: { status },
      });

      logger.info(`Updated order from Shopify webhook: ${order.id}`);
    } catch (error) {
      logger.error('Failed to process Shopify order update', error);
      throw new AppError('Failed to process Shopify order update', 500, error);
    }
  }

  private async handleOrderCancelled(payload: any) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          partnerId: this.partnerId,
          metadata: {
            path: ['shopifyOrderId'],
            equals: payload.id,
          },
        },
      });

      if (!order) {
        logger.warn(`Order not found for Shopify cancellation: ${payload.id}`);
        return null;
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'cancelled' },
      });

      logger.info(`Cancelled order from Shopify webhook: ${order.id}`);
    } catch (error) {
      logger.error('Failed to process Shopify order cancellation', error);
      throw new AppError('Failed to process Shopify order cancellation', 500, error);
    }
  }

  private transformShopifyOrder(shopifyOrder: any) {
    return {
      items: shopifyOrder.line_items.map((item: any) => ({
        productId: item.product_id.toString(),
        quantity: item.quantity,
        metadata: {
          variantId: item.variant_id,
          sku: item.sku,
          properties: item.properties,
        },
      })),
      customerData: {
        name: shopifyOrder.customer.first_name + ' ' + shopifyOrder.customer.last_name,
        email: shopifyOrder.customer.email,
        address: {
          street: shopifyOrder.shipping_address.address1,
          city: shopifyOrder.shipping_address.city,
          state: shopifyOrder.shipping_address.province,
          postalCode: shopifyOrder.shipping_address.zip,
          country: shopifyOrder.shipping_address.country_code,
        },
      },
    };
  }

  private mapShopifyStatus(fulfillmentStatus: string | null): string {
    switch (fulfillmentStatus) {
      case 'fulfilled':
        return 'shipped';
      case 'partial':
        return 'processing';
      case null:
        return 'pending';
      default:
        return 'processing';
    }
  }
} 