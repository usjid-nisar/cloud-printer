import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export const orderController = {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderNumber, items, customerData } = req.body;
      const partnerId = req.partner.id; // Set by auth middleware

      const order = await prisma.order.create({
        data: {
          partnerId,
          orderNumber,
          status: 'pending',
          items,
          customerData,
        },
      });

      logger.info(`Order created: ${order.id}`);
      res.status(201).json(order);
    } catch (error) {
      next(new AppError('Failed to create order', 500, error));
    }
  },

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const partnerId = req.partner.id;

      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          partnerId,
        },
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.json(order);
    } catch (error) {
      next(error);
    }
  },

  async listOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const partnerId = req.partner.id;
      const { status, page = 1, limit = 10 } = req.query;

      const where = {
        partnerId,
        ...(status && { status: String(status) }),
      };

      const orders = await prisma.order.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
          createdAt: 'desc',
        },
      });

      const total = await prisma.order.count({ where });

      res.json({
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const partnerId = req.partner.id;

      const order = await prisma.order.update({
        where: {
          id: orderId,
          partnerId,
        },
        data: {
          status,
        },
      });

      logger.info(`Order ${orderId} updated to status: ${status}`);
      res.json(order);
    } catch (error) {
      next(error);
    }
  },
}; 