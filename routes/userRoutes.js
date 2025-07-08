const express = require("express");
const router = express.Router();
const { createUserValidator, updateUserValidator } = require("../validators/userValidator");
const handleValidation = require("../middlewares/validationResultHandler");
const userController = require("../controllers/userController");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Manajemen User
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Buat user baru
 *     tags: [Users]
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
 *               password:
 *                 type: string
 *               password_plain_text:
 *                 type: string
 *     responses:
 *       201:
 *         description: User berhasil dibuat
 */
router.post("/", authenticate, authorizeRole("admin", "owner"), createUserValidator, handleValidation, userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update data user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user
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
 *               password:
 *                 type: string
 *               password_plain_text:
 *                 type: string
 *     responses:
 *       200:
 *         description: User berhasil diupdate
 */
router.put("/:id", authenticate, authorizeRole("admin", "owner"), updateUserValidator, handleValidation, userController.updateUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Ambil semua user (dapat difilter berdasarkan nama, email, username, no_hp, dan role)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: nama
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama (tidak case-sensitive)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter berdasarkan email
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filter berdasarkan username
 *       - in: query
 *         name: no_hp
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nomor HP
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter berdasarkan role user
 *     responses:
 *       200:
 *         description: Daftar user
 */
router.get("/", authenticate, authorizeRole("admin", "owner"), userController.showAllUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Detail user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user
 *     responses:
 *       200:
 *         description: Detail user
 */
router.get("/:id", authenticate, authorizeRole("admin", "owner"), userController.detailUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Hapus user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 */
router.delete("/:id", authenticate, authorizeRole("admin", "owner"), userController.deleteUser);

module.exports = router;
