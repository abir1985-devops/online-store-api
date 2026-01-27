const express = require('express');
const orderController = require('../controllers/orderController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Create an order (logged-in user)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [product, quantity]
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: "Product id"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: "Order created"
 *       401:
 *         description: "Not logged in"
 */

/**
 * @openapi
 * /api/orders/my:
 *   get:
 *     summary: Get my orders (logged-in user)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "My orders"
 *       401:
 *         description: "Not logged in"
 */

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "All orders"
 *       403:
 *         description: "Not allowed"
 */

/**
 * @openapi
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (admin only)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Order id"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 example: "paid"
 *     responses:
 *       200:
 *         description: "Order updated"
 *       404:
 *         description: "Order not found"
 */

/**
 * @openapi
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel my pending order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Order id"
 *     responses:
 *       200:
 *         description: "Order cancelled"
 *       403:
 *         description: "Not allowed"
 *       400:
 *         description: "Only pending orders can be cancelled"
 */


router.get('/my', authMiddleware.protect, orderController.getMyOrders);

router.get(
  '/',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  orderController.getAllOrders
);
router.patch(
    '/:id/status',
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    orderController.updateOrderStatus
    );
router.patch(
    '/:id/cancel', authMiddleware.protect, 
     orderController.cancelMyOrder);

// user must be logged in to create an order
router.post('/', authMiddleware.protect, 
      orderController.createOrder);

module.exports = router;

