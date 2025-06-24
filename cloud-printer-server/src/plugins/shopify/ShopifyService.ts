import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';

const prisma = new PrismaClient();

export class ShopifyService {
  private partnerId: string;

  constructor(partnerId: string) {
    this.partnerId = partnerId;
  }

  async initialize() {
    // Verify partner exists and has Shopify integration
    const partner = await prisma.partner.findUnique({
      where: { id: this.partnerId },
      include: {
        integrations: {
          where: { platform: 'shopify' },
        },
      },
    });

    if (!partner) {
      throw new AppError('Partner not found', 404);
    }

    if (!partner.integrations.length) {
      throw new AppError('Shopify integration not found', 404);
    }
  }

  async processOrder(orderData: any) {
    try {
      logger.info(`Processing Shopify order for partner ${this.partnerId}`);

      // Extract order details
      const {
        id: shopifyOrderId,
        order_number: orderNumber,
        line_items: items,
        customer,
        shipping_address: address,
      } = orderData;

      // Create order in database
      const order = await prisma.order.create({
        data: {
          partnerId: this.partnerId,
          orderNumber: String(orderNumber),
          status: 'pending',
          source: 'shopify',
          items: items,
          customerData: {
            name: `${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            address: {
              street: address.address1,
              city: address.city,
              state: address.province,
              postalCode: address.zip,
              country: address.country,
            },
          },
          metadata: {
            shopifyOrderId,
            source: 'shopify',
          },
        },
      });

      logger.info(`Created order ${order.id} from Shopify order ${shopifyOrderId}`);
      return order;
    } catch (error) {
      logger.error('Failed to process Shopify order:', error);
      throw new AppError('Failed to process Shopify order', 500);
    }
  }

  async cancelOrder(orderData: any) {
    try {
      const { id: shopifyOrderId } = orderData;

      // Find the order in our system
      const order = await prisma.order.findFirst({
        where: {
          partnerId: this.partnerId,
          metadata: {
            path: ['shopifyOrderId'],
            equals: shopifyOrderId,
          },
        },
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'cancelled' },
      });

      logger.info(`Cancelled order ${order.id} from Shopify order ${shopifyOrderId}`);
    } catch (error) {
      logger.error('Failed to cancel Shopify order:', error);
      throw new AppError('Failed to cancel Shopify order', 500);
    }
  }
} 