const express = require("express");
const router = express.Router();
const { createPtValidator, updatePtValidator } = require("../validators/ptValidator");
const handleValidation = require("../middlewares/validationResultHandler");
const ptController = require("../controllers/ptController");

/**
 * @swagger
 * tags:
 *   name: PT
 *   description: Manajemen PT
 */

/**
 * @swagger
 * /pt:
 *   post:
 *     summary: Buat PT baru
 *     tags: [PT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_pt:
 *                 type: string
 *               keterangan:
 *                 type: string
 *     responses:
 *       201:
 *         description: PT berhasil dibuat
 */
router.post("/", createPtValidator, handleValidation, ptController.createPt);

/**
 * @swagger
 * /pt/{id}:
 *   put:
 *     summary: Update data PT
 *     tags: [PT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID PT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_pt:
 *                 type: string
 *               keterangan:
 *                 type: string
 *     responses:
 *       200:
 *         description: PT berhasil diupdate
 */
router.put("/:id", updatePtValidator, handleValidation, ptController.updatePt);

/**
 * @swagger
 * /pt:
 *   get:
 *     summary: Ambil semua PT (dapat difilter berdasarkan nama_pt dan keterangan)
 *     tags: [PT]
 *     parameters:
 *       - in: query
 *         name: nama_pt
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama PT (tidak case-sensitive)
 *       - in: query
 *         name: keterangan
 *         schema:
 *           type: string
 *         description: Filter berdasarkan keterangan PT (tidak case-sensitive)
 *     responses:
 *       200:
 *         description: Daftar PT
 */
router.get("/", ptController.showAllPt);

/**
 * @swagger
 * /pt/{id}:
 *   get:
 *     summary: Detail PT by ID
 *     tags: [PT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID PT
 *     responses:
 *       200:
 *         description: Detail PT
 */
router.get("/:id", ptController.detailPt);

/**
 * @swagger
 * /pt/{id}:
 *   delete:
 *     summary: Hapus PT
 *     tags: [PT]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID PT
 *     responses:
 *       200:
 *         description: PT berhasil dihapus
 */
router.delete("/:id", ptController.deletePt);

module.exports = router;
