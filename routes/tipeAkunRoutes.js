const express = require("express");
const router = express.Router();
const { createTipeAkunValidator, updateTipeAkunValidator } = require("../validators/tipeAkunValidator");
const handleValidation = require("../middlewares/validationResultHandler");
const tipeAkunController = require("../controllers/tipeAkunController");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Tipe Akun
 *   description: Manajemen Tipe Akun
 */

/**
 * @swagger
 * /tipe-akun:
 *   post:
 *     summary: Buat Tipe Akun baru
 *     tags: [Tipe Akun]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_tipe:
 *                 type: string
 *               no_tipe:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tipe Akun berhasil dibuat
 */
router.post("/", authenticate, authorizeRole("admin", "owner"), createTipeAkunValidator, handleValidation, tipeAkunController.createTipeAkun);

/**
 * @swagger
 * /tipe-akun/{id}:
 *   put:
 *     summary: Update data Tipe Akun
 *     tags: [Tipe Akun]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Tipe Akun
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_tipe:
 *                 type: string
 *               no_tipe:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tipe Akun berhasil diupdate
 */
router.put("/:id", authenticate, authorizeRole("admin", "owner"), updateTipeAkunValidator, handleValidation, tipeAkunController.updateTipeAkun);

/**
 * @swagger
 * /tipe-akun:
 *   get:
 *     summary: Ambil semua Tipe Akun (dapat difilter berdasarkan nama_tipe dan no_tipe)
 *     tags: [Tipe Akun]
 *     parameters:
 *       - in: query
 *         name: nama_tipe
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama tipe akun (tidak case-sensitive)
 *       - in: query
 *         name: no_tipe
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nomor tipe akun (mirip)
 *     responses:
 *       200:
 *         description: Daftar Tipe Akun
 */
router.get("/", authenticate, authorizeRole("admin", "owner"), tipeAkunController.showAllTipeAkun);

/**
 * @swagger
 * /tipe-akun/{id}:
 *   get:
 *     summary: Detail Tipe Akun by ID
 *     tags: [Tipe Akun]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Tipe Akun
 *     responses:
 *       200:
 *         description: Detail Tipe Akun
 */
router.get("/:id", authenticate, authorizeRole("admin", "owner"), tipeAkunController.detailTipeAkun);

/**
 * @swagger
 * /tipe-akun/{id}:
 *   delete:
 *     summary: Hapus Tipe Akun
 *     tags: [Tipe Akun]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Tipe Akun
 *     responses:
 *       200:
 *         description: Tipe Akun berhasil dihapus
 */
router.delete("/:id", authenticate, authorizeRole("admin", "owner"), tipeAkunController.deleteTipeAkun);

module.exports = router;
