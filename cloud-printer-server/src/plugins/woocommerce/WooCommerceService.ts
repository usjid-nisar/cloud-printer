import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';

const prisma = new PrismaClient();

export class WooCommerceService {
  private partnerId: string;

  constructor(partnerId: string) {
    this.partnerId = partnerId;
  }

  async initialize() {
    // Verify partner exists and has WooCommerce integration
    const partner = await prisma.partner.findUnique({
      where: { id: this.partnerId },
      include: {
        integrations: {
          where: { platform: 'woocommerce' },
        },
      },
    });

    if (!partner) {
      throw new AppError('Partner not found', 404);
    }

    if (!partner.integrations.length) {
      throw new AppError('WooCommerce integration not found', 404);
    }
  }

  async processOrder(orderData: any) {
    try {
      logger.info(`Processing WooCommerce order for partner ${this.partnerId}`);

      // Extract order details
      const {
        id: wooCommerceOrderId,
        number: orderNumber,
        line_items: items,
        billing,
        shipping,
      } = orderData;

      // Create order in database
      const order = await prisma.order.create({
        data: {
          partnerId: this.partnerId,
          orderNumber: String(orderNumber),
          status: 'pending',
          source: 'woocommerce',
          items: items,
          customerData: {
            name: `${billing.first_name} ${billing.last_name}`,
            email: billing.email,
            address: {
              street: shipping.address_1,
              city: shipping.city,
              state: shipping.state,
              postalCode: shipping.postcode,
              country: shipping.country,
            },
          },
          metadata: {
            wooCommerceOrderId,
            source: 'woocommerce',
          },
        },
      });

      logger.info(`Created order ${order.id} from WooCommerce order ${wooCommerceOrderId}`);
      return order;
    } catch (error) {
      logger.error('Failed to process WooCommerce order:', error);
      throw new AppError('Failed to process WooCommerce order', 500);
    }
  }

  async cancelOrder(orderData: any) {
    try {
      const { id: wooCommerceOrderId } = orderData;

      // Find the order in our system
      const order = await prisma.order.findFirst({
        where: {
          partnerId: this.partnerId,
          metadata: {
            path: ['wooCommerceOrderId'],
            equals: wooCommerceOrderId,
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

      logger.info(`Cancelled order ${order.id} from WooCommerce order ${wooCommerceOrderId}`);
    } catch (error) {
      logger.error('Failed to cancel WooCommerce order:', error);
      throw new AppError('Failed to cancel WooCommerce order', 500);
    }
  }
} 