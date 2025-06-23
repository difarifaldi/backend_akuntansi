const express = require("express");
const router = express.Router();
const { createTipeAkunValidator, updateTipeAkunValidator } = require("../validators/tipeAkunValidator");
const handleValidation = require("../middlewares/validationResultHandler");
const tipeAkunController = require("../controllers/tipeAkunController");

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
router.post("/", createTipeAkunValidator, handleValidation, tipeAkunController.createTipeAkun);

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
router.put("/:id", updateTipeAkunValidator, handleValidation, tipeAkunController.updateTipeAkun);

/**
 * @swagger
 * /tipe-akun:
 *   get:
 *     summary: Ambil semua Tipe Akun
 *     tags: [Tipe Akun]
 *     responses:
 *       200:
 *         description: Daftar Tipe Akun
 */
router.get("/", tipeAkunController.showAllTipeAkun);

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
router.get("/:id", tipeAkunController.detailTipeAkun);

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
router.delete("/:id", tipeAkunController.deleteTipeAkun);

module.exports = router;
