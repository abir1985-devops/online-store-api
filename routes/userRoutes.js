const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Get my profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "My profile"
 *       401:
 *         description: "Not logged in"
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "List of users"
 *       403:
 *         description: "Not allowed"
 */

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by id (admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "User id"
 *     responses:
 *       200:
 *         description: "User found"
 *       404:
 *         description: "User not found"
 */

/**
 * @openapi
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update user role (admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "User id"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: "Role updated"
 *       404:
 *         description: "User not found"
 */

// ✅ Specific routes first
router.get('/me', authMiddleware.protect, userController.getMe);
router.patch('/me', authMiddleware.protect, userController.updateMe);

router.patch(
  '/:id/role',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  userController.updateUserRole
);

// ✅ Then general routes
router.route('/')
  .get(authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.getAllUsers);

router.route('/:id')
  .get(authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.getUserById);

module.exports = router;

