import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.partner) {
      throw new AppError('Unauthorized', 401);
    }
    const partnerId = req.partner.id;
    const { orderNumber, items, customerData } = req.body;

    const order = await prisma.order.create({
      data: {
        partnerId,
        orderNumber,
        status: 'pending',
        items,
        customerData,
        source: 'api', // Set default source as API
      },
    });

    res.status(201).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.partner) {
      throw new AppError('Unauthorized', 401);
    }
    const partnerId = req.partner.id;
    const { status, page = 1, limit = 10 } = req.query;

    const where: any = { partnerId };
    if (status) {
      where.status = status;
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip: (+page - 1) * +limit,
        take: +limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      status: 'success',
      data: {
        orders,
        pagination: {
          total,
          page: +page,
          pages: Math.ceil(total / +limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.partner) {
      throw new AppError('Unauthorized', 401);
    }
    const partnerId = req.partner.id;
    const { orderId } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        partnerId,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.partner) {
      throw new AppError('Unauthorized', 401);
    }
    const partnerId = req.partner.id;
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        partnerId,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    res.json({
      status: 'success',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
}; 