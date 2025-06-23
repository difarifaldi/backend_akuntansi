const express = require("express");
const router = express.Router();
const { loginValidator } = require("../validators/authValidator");
const handleValidation = require("../middlewares/validationResultHandler");
const authController = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autentikasi
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil (mengembalikan token & data user)
 *       401:
 *         description: Username atau password salah
 */
router.post("/login", loginValidator, handleValidation, authController.login);

module.exports = router;
