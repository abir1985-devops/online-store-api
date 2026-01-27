const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Items per page"
 *     responses:
 *       200:
 *         description: "Paginated list of products"
 *
 *   post:
 *     summary: Create a product (admin only)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: "Product created"
 */


router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.createProduct
  )
  .get(productController.getAllProducts);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get product by id
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Product id"
 *     responses:
 *       200:
 *         description: "Product found"
 *       404:
 *         description: "Product not found"
 *
 *   patch:
 *     summary: Update a product (admin only)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Product updated"
 *
 *   delete:
 *     summary: Delete a product (admin only)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: "Product deleted"
 */
  
router
  .route('/:id')
  .get(productController.getProductById)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.updateProduct
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.deleteProduct
  );
module.exports = router;
