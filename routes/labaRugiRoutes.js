const express = require("express");
const router = express.Router();
const labaRugiController = require("../controllers/labaRugiController");

/**
 * @swagger
 * tags:
 *   name: Laba Rugi
 *   description: Laporan Laba Rugi berdasarkan transaksi
 */

/**
 * @swagger
 * /laba-rugi:
 *   get:
 *     summary: Ambil laporan laba rugi
 *     tags: [Laba Rugi]
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
 *         description: Laporan laba rugi berhasil diambil
 */
router.get("/", labaRugiController.laporanLabaRugi);

/**
 * @swagger
 * /laba-rugi/export:
 *   get:
 *     summary: Export laporan laba rugi dalam format PDF
 *     tags: [Laba Rugi]
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
 *         description: File PDF laba rugi berhasil diunduh
 */
router.get("/export", labaRugiController.exportLabaRugiPDF);

module.exports = router;
