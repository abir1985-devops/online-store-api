// routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Signup (create a new user)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Abir"
 *               email:
 *                 type: string
 *                 example: "abir@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: "User created"
 *       400:
 *         description: "Invalid input"
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "abir@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: "Login successful"
 *       401:
 *         description: "Incorrect email or password"
 */


router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;
