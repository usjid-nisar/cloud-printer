import { Router } from 'express';
import { validateApiKey } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { createOrder, getOrder, getOrders, updateOrder } from '../controllers/orderController';
import { createOrderSchema, updateOrderSchema } from '../validators/orderValidators';

const router = Router();

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
router.post('/', validateRequest(createOrderSchema), createOrder);

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
router.get('/', getOrders);

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
router.get('/:orderId', getOrder);

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
router.patch('/:orderId', validateRequest(updateOrderSchema), updateOrder);

// Apply API key validation to all routes
router.use(validateApiKey);

export const orderRoutes = router; 