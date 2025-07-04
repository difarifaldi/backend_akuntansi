const express = require("express");
const router = express.Router();
const { createRekeningValidator, updateRekeningValidator } = require("../validators/rekeningValidator");
const handleValidation = require("../middlewares/validationResultHandler");
const rekeningController = require("../controllers/rekeningController");

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
router.post("/", createRekeningValidator, handleValidation, rekeningController.createRekening);

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
router.put("/:id", updateRekeningValidator, handleValidation, rekeningController.updateRekening);

/**
 * @swagger
 * /rekening:
 *   get:
 *     summary: Ambil semua Rekening
 *     tags: [Rekening]
 *     responses:
 *       200:
 *         description: Daftar Rekening
 */
router.get("/", rekeningController.showAllRekening);

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
router.get("/:id", rekeningController.detailRekening);

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
router.delete("/:id", rekeningController.deleteRekening);

module.exports = router;
