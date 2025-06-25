"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validateRequest_1 = require("../middleware/validateRequest");
const orderController_1 = require("../controllers/orderController");
const orderValidators_1 = require("../validators/orderValidators");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderNumber
 *               - items
 *               - customerData
 *             properties:
 *               orderNumber:
 *                 type: string
 *               items:
 *                 type: array
 *               customerData:
 *                 type: object
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/', (0, validateRequest_1.validateRequest)(orderValidators_1.createOrderSchema), orderController_1.createOrder);
/**
 * @swagger
 * /v1/orders:
 *   get:
 *     summary: List orders
 *     tags: [Orders]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
 */
router.get('/', orderController_1.getOrders);
/**
 * @swagger
 * /v1/orders/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 */
router.get('/:orderId', orderController_1.getOrder);
/**
 * @swagger
 * /v1/orders/{orderId}:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 */
router.patch('/:orderId', (0, validateRequest_1.validateRequest)(orderValidators_1.updateOrderSchema), orderController_1.updateOrder);
// Apply API key validation to all routes
router.use(auth_1.validateApiKey);
exports.orderRoutes = router;
