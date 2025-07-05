const express = require("express");
const router = express.Router();
const { createTransaksiValidator, updateTransaksiValidator } = require("../validators/transaksiValidator");
const handleValidation = require("../middlewares/validationResultHandler");
const transaksiController = require("../controllers/transaksiController");

/**
 * @swagger
 * tags:
 *   name: Transaksi
 *   description: Manajemen Transaksi
 */

/**
 * @swagger
 * /transaksi:
 *   post:
 *     summary: Buat Transaksi baru
 *     tags: [Transaksi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tanggal:
 *                 type: string
 *               id_table_of_akun:
 *                 type: integer
 *               keterangan:
 *                 type: string
 *               debit:
 *                 type: number
 *               kredit:
 *                 type: number
 *               id_rekening:
 *                 type: integer
 *               mata_uang:
 *                 type: string
 *               created_by:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Transaksi berhasil dibuat
 */
router.post("/", createTransaksiValidator, handleValidation, transaksiController.createTransaksi);

/**
 * @swagger
 * /transaksi/{id}:
 *   put:
 *     summary: Update data Transaksi
 *     tags: [Transaksi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Transaksi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tanggal:
 *                 type: string
 *               id_table_of_akun:
 *                 type: integer
 *               keterangan:
 *                 type: string
 *               debit:
 *                 type: number
 *               kredit:
 *                 type: number
 *               id_rekening:
 *                 type: integer
 *               mata_uang:
 *                 type: string
 *               created_by:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Transaksi berhasil diupdate
 */
router.put("/:id", updateTransaksiValidator, handleValidation, transaksiController.updateTransaksi);

/**
 * @swagger
 * /transaksi:
 *   get:
 *     summary: Ambil semua Transaksi (bisa filter dengan banyak parameter)
 *     tags: [Transaksi]
 *     parameters:
 *       - in: query
 *         name: id_rekening
 *         schema:
 *           type: integer
 *         description: Filter transaksi berdasarkan ID Rekening
 *       - in: query
 *         name: id_table_of_akun
 *         schema:
 *           type: integer
 *         description: Filter transaksi berdasarkan ID Akun
 *       - in: query
 *         name: keterangan
 *         schema:
 *           type: string
 *         description: Filter berdasarkan keterangan (tidak case-sensitive)
 *       - in: query
 *         name: start_tanggal
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transaksi dari tanggal (YYYY-MM-DD)
 *       - in: query
 *         name: end_tanggal
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transaksi sampai tanggal (YYYY-MM-DD)
 *       - in: query
 *         name: tipe_transaksi
 *         schema:
 *           type: string
 *           enum: [debit, kredit]
 *         description: Filter berdasarkan tipe transaksi (debit atau kredit)
 *       - in: query
 *         name: mata_uang
 *         schema:
 *           type: string
 *         description: Filter berdasarkan mata uang dari tabel Rekening (tidak case-sensitive)
 *     responses:
 *       200:
 *         description: Daftar Transaksi
 */
router.get("/", transaksiController.showAllTransaksi);

/**
 * @swagger
 * /transaksi/export-pdf:
 *   get:
 *     summary: Export transaksi ke PDF
 *     tags:
 *       - Transaksi
 *     parameters:
 *       - in: query
 *         name: id_rekening
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter berdasarkan ID rekening
 *       - in: query
 *         name: start_tanggal
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filter tanggal mulai (YYYY-MM-DD)
 *       - in: query
 *         name: end_tanggal
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filter tanggal akhir (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: File PDF yang berisi data transaksi
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Server error
 */
router.get("/export-pdf", transaksiController.exportPDF);

/**
 * @swagger
 * /transaksi/{id}:
 *   get:
 *     summary: Detail Transaksi by ID
 *     tags: [Transaksi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Transaksi
 *     responses:
 *       200:
 *         description: Detail Transaksi
 */
router.get("/:id", transaksiController.detailTransaksi);

/**
 * @swagger
 * /transaksi/{id}:
 *   delete:
 *     summary: Hapus Transaksi
 *     tags: [Transaksi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Transaksi
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 */
router.delete("/:id", transaksiController.deleteTransaksi);

module.exports = router;
