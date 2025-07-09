const express = require("express");
const router = express.Router();
const neracaController = require("../controllers/neracaController");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: neraca
 *   description: Laporan neraca berdasarkan transaksi
 */

/**
 * @swagger
 * /neraca:
 *   get:
 *     summary: Ambil laporan neraca
 *     tags: [neraca]
 *     parameters:
 *       - in: query
 *         name: id_rekening
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan ID rekening
 *       - in: query
 *         name: start_tanggal
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal mulai (YYYY-MM-DD)
 *       - in: query
 *         name: end_tanggal
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal akhir (YYYY-MM-DD)
 *       - in: query
 *         name: mata_uang
 *         schema:
 *           type: string
 *         description: Filter berdasarkan mata uang dari rekening (mis. IDR, USD)
 *     responses:
 *       200:
 *         description: Laporan neraca berhasil diambil
 */
router.get("/", authenticate, authorizeRole("admin", "owner", "user"), neracaController.laporanNeraca);

/**
 * @swagger
 * /neraca/export:
 *   get:
 *     summary: Export laporan neraca dalam format PDF
 *     tags: [neraca]
 *     parameters:
 *       - in: query
 *         name: id_rekening
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan ID rekening
 *       - in: query
 *         name: start_tanggal
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal mulai (YYYY-MM-DD)
 *       - in: query
 *         name: end_tanggal
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal akhir (YYYY-MM-DD)
 *       - in: query
 *         name: mata_uang
 *         schema:
 *           type: string
 *         description: Filter berdasarkan mata uang dari rekening (mis. IDR, USD)
 *     responses:
 *       200:
 *         description: File PDF neraca berhasil diunduh
 */
router.get("/export", authenticate, authorizeRole("admin", "owner", "user"), neracaController.exportNeracaPDF);

module.exports = router;
