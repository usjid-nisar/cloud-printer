"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../../utils/logger");
const AppError_1 = require("../../utils/AppError");
const prisma = new client_1.PrismaClient();
class ShopifyService {
    constructor(partnerId) {
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
            throw new AppError_1.AppError('Partner not found', 404);
        }
        if (!partner.integrations.length) {
            throw new AppError_1.AppError('Shopify integration not found', 404);
        }
    }
    async processOrder(orderData) {
        try {
            logger_1.logger.info(`Processing Shopify order for partner ${this.partnerId}`);
            // Extract order details
            const { id: shopifyOrderId, order_number: orderNumber, line_items: items, customer, shipping_address: address, } = orderData;
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
            logger_1.logger.info(`Created order ${order.id} from Shopify order ${shopifyOrderId}`);
            return order;
        }
        catch (error) {
            logger_1.logger.error('Failed to process Shopify order:', error);
            throw new AppError_1.AppError('Failed to process Shopify order', 500);
        }
    }
    async cancelOrder(orderData) {
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
                throw new AppError_1.AppError('Order not found', 404);
            }
            // Update order status
            await prisma.order.update({
                where: { id: order.id },
                data: { status: 'cancelled' },
            });
            logger_1.logger.info(`Cancelled order ${order.id} from Shopify order ${shopifyOrderId}`);
        }
        catch (error) {
            logger_1.logger.error('Failed to cancel Shopify order:', error);
            throw new AppError_1.AppError('Failed to cancel Shopify order', 500);
        }
    }
}
exports.ShopifyService = ShopifyService;
