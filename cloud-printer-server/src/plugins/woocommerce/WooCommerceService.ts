import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';

const prisma = new PrismaClient();

export class WooCommerceService {
  private partnerId: string;
  private wooConfig: any;

  constructor(partnerId: string) {
    this.partnerId = partnerId;
  }

  async initialize() {
    const integration = await prisma.integration.findUnique({
      where: {
        partnerId_platform: {
          partnerId: this.partnerId,
          platform: 'woocommerce',
        },
      },
    });

    if (!integration) {
      throw new AppError('WooCommerce integration not found', 404);
    }

    this.wooConfig = integration.config;
  }

  async handleWebhook(topic: string, payload: any) {
    logger.info(`Processing WooCommerce webhook: ${topic}`, {
      partnerId: this.partnerId,
      topic,
    });

    switch (topic) {
      case 'order.created':
        return this.handleOrderCreated(payload);
      case 'order.updated':
        return this.handleOrderUpdated(payload);
      case 'order.deleted':
        return this.handleOrderDeleted(payload);
      default:
        logger.warn(`Unhandled WooCommerce webhook topic: ${topic}`);
        return null;
    }
  }

  private async handleOrderCreated(payload: any) {
    try {
      const orderData = this.transformWooCommerceOrder(payload);
      
      const order = await prisma.order.create({
        data: {
          partnerId: this.partnerId,
          orderNumber: payload.number.toString(),
          status: 'pending',
          items: orderData.items,
          customerData: orderData.customerData,
          metadata: {
            wooCommerceOrderId: payload.id,
            source: 'woocommerce',
          },
        },
      });

      logger.info(`Created order from WooCommerce webhook: ${order.id}`);
      return order;
    } catch (error) {
      logger.error('Failed to process WooCommerce order creation', error);
      throw new AppError('Failed to process WooCommerce order', 500, error);
    }
  }

  private async handleOrderUpdated(payload: any) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          partnerId: this.partnerId,
          metadata: {
            path: ['wooCommerceOrderId'],
            equals: payload.id,
          },
        },
      });

      if (!order) {
        logger.warn(`Order not found for WooCommerce update: ${payload.id}`);
        return null;
      }

      const status = this.mapWooCommerceStatus(payload.status);
      
      await prisma.order.update({
        where: { id: order.id },
        data: { status },
      });

      logger.info(`Updated order from WooCommerce webhook: ${order.id}`);
    } catch (error) {
      logger.error('Failed to process WooCommerce order update', error);
      throw new AppError('Failed to process WooCommerce order update', 500, error);
    }
  }

  private async handleOrderDeleted(payload: any) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          partnerId: this.partnerId,
          metadata: {
            path: ['wooCommerceOrderId'],
            equals: payload.id,
          },
        },
      });

      if (!order) {
        logger.warn(`Order not found for WooCommerce deletion: ${payload.id}`);
        return null;
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'cancelled' },
      });

      logger.info(`Marked order as cancelled from WooCommerce webhook: ${order.id}`);
    } catch (error) {
      logger.error('Failed to process WooCommerce order deletion', error);
      throw new AppError('Failed to process WooCommerce order deletion', 500, error);
    }
  }

  private transformWooCommerceOrder(wooOrder: any) {
    return {
      items: wooOrder.line_items.map((item: any) => ({
        productId: item.product_id.toString(),
        quantity: item.quantity,
        metadata: {
          variationId: item.variation_id,
          sku: item.sku,
          total: item.total,
        },
      })),
      customerData: {
        name: `${wooOrder.billing.first_name} ${wooOrder.billing.last_name}`,
        email: wooOrder.billing.email,
        address: {
          street: wooOrder.shipping.address_1,
          city: wooOrder.shipping.city,
          state: wooOrder.shipping.state,
          postalCode: wooOrder.shipping.postcode,
          country: wooOrder.shipping.country,
        },
      },
    };
  }

  private mapWooCommerceStatus(wooStatus: string): string {
    switch (wooStatus) {
      case 'completed':
        return 'delivered';
      case 'processing':
        return 'processing';
      case 'on-hold':
        return 'pending';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  }
} 