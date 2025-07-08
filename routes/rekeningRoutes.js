const express = require("express");
const router = express.Router();
const { createRekeningValidator, updateRekeningValidator } = require("../validators/rekeningValidator");
const handleValidation = require("../middlewares/validationResultHandler");
const rekeningController = require("../controllers/rekeningController");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Rekening
 *   description: Manajemen Rekening
 */

/**
 * @swagger
 * /rekening:
 *   post:
 *     summary: Buat Rekening baru
 *     tags: [Rekening]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               no_rekening:
 *                 type: string
 *               nama_rekening:
 *                 type: string
 *               id_pt:
 *                 type: integer
 *               mata_uang:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rekening berhasil dibuat
 */
router.post("/", authenticate, authorizeRole("admin", "owner"), createRekeningValidator, handleValidation, rekeningController.createRekening);

/**
 * @swagger
 * /rekening/{id}:
 *   put:
 *     summary: Update data Rekening
 *     tags: [Rekening]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Rekening
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               no_rekening:
 *                 type: string
 *               nama_rekening:
 *                 type: string
 *               id_pt:
 *                 type: integer
 *               mata_uang:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rekening berhasil diupdate
 */
router.put("/:id", authenticate, authorizeRole("admin", "owner"), updateRekeningValidator, handleValidation, rekeningController.updateRekening);

/**
 * @swagger
 * /rekening:
 *   get:
 *     summary: Ambil semua Rekening (dapat difilter berdasarkan no_rekening, nama_rekening, id_pt, mata_uang)
 *     tags: [Rekening]
 *     parameters:
 *       - in: query
 *         name: no_rekening
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nomor rekening
 *       - in: query
 *         name: nama_rekening
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama rekening (tidak case-sensitive)
 *       - in: query
 *         name: id_pt
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan ID PT
 *       - in: query
 *         name: mata_uang
 *         schema:
 *           type: string
 *         description: Filter berdasarkan mata uang
 *     responses:
 *       200:
 *         description: Daftar Rekening
 */

router.get("/", authenticate, authorizeRole("admin", "owner"), rekeningController.showAllRekening);

/**
 * @swagger
 * /rekening/{id}:
 *   get:
 *     summary: Detail Rekening by ID
 *     tags: [Rekening]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Rekening
 *     responses:
 *       200:
 *         description: Detail Rekening
 */
router.get("/:id", authenticate, authorizeRole("admin", "owner"), rekeningController.detailRekening);

/**
 * @swagger
 * /rekening/{id}:
 *   delete:
 *     summary: Hapus Rekening
 *     tags: [Rekening]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Rekening
 *     responses:
 *       200:
 *         description: Rekening berhasil dihapus
 */
router.delete("/:id", authenticate, authorizeRole("admin", "owner"), rekeningController.deleteRekening);

module.exports = router;
