"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.getOrder = exports.getOrders = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const prisma = new client_1.PrismaClient();
const createOrder = async (req, res, next) => {
    try {
        if (!req.partner) {
            throw new AppError_1.AppError('Unauthorized', 401);
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
    }
    catch (error) {
        next(error);
    }
};
exports.createOrder = createOrder;
const getOrders = async (req, res, next) => {
    try {
        if (!req.partner) {
            throw new AppError_1.AppError('Unauthorized', 401);
        }
        const partnerId = req.partner.id;
        const { status, page = 1, limit = 10 } = req.query;
        const where = { partnerId };
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
    }
    catch (error) {
        next(error);
    }
};
exports.getOrders = getOrders;
const getOrder = async (req, res, next) => {
    try {
        if (!req.partner) {
            throw new AppError_1.AppError('Unauthorized', 401);
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
            throw new AppError_1.AppError('Order not found', 404);
        }
        res.json({
            status: 'success',
            data: order,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrder = getOrder;
const updateOrder = async (req, res, next) => {
    try {
        if (!req.partner) {
            throw new AppError_1.AppError('Unauthorized', 401);
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
            throw new AppError_1.AppError('Order not found', 404);
        }
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
        res.json({
            status: 'success',
            data: updatedOrder,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrder = updateOrder;
