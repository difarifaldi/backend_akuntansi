const express = require("express");
const router = express.Router();
const { loginValidator } = require("../validators/authValidator");
const handleValidation = require("../middlewares/validationResultHandler");
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");
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

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Ambil profil pengguna yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data profil user yang sedang login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 nama:
 *                   type: string
 *                 email:
 *                   type: string
 *                 no_hp:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 */
router.get("/profile", authenticate, authController.getProfile);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update profil pengguna yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               no_hp:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: user
 *               password:
 *                 type: string
 *                 description: Password baru (opsional)
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: User tidak ditemukan
 */
router.put("/profile", authenticate, authController.updateProfile);

module.exports = router;
