const express = require("express");
const router = express.Router();
const { createTableOfAkunValidator, updateTableOfAkunValidator } = require("../validators/tableOfAkunValidator");
const handleValidation = require("../middlewares/validationResultHandler");
const tableOfAkunController = require("../controllers/tableOfAkunController");

/**
 * @swagger
 * tags:
 *   name: Table Of Akun
 *   description: Manajemen Table Of Akun
 */

/**
 * @swagger
 * /table-of-akun:
 *   post:
 *     summary: Buat Akun baru
 *     tags: [Table Of Akun]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               no_akun:
 *                 type: string
 *               nama_akun:
 *                 type: string
 *               id_tipe_akun:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Akun berhasil dibuat
 */
router.post("/", createTableOfAkunValidator, handleValidation, tableOfAkunController.createTableOfAkun);

/**
 * @swagger
 * /table-of-akun/{id}:
 *   put:
 *     summary: Update data Akun
 *     tags: [Table Of Akun]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Akun
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               no_akun:
 *                 type: string
 *               nama_akun:
 *                 type: string
 *               id_tipe_akun:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Akun berhasil diupdate
 */
router.put("/:id", updateTableOfAkunValidator, handleValidation, tableOfAkunController.updateTableOfAkun);

/**
 * @swagger
 * /table-of-akun:
 *   get:
 *     summary: Ambil semua Akun
 *     tags: [Table Of Akun]
 *     responses:
 *       200:
 *         description: Daftar Akun
 */
router.get("/", tableOfAkunController.showAllTableOfAkun);

/**
 * @swagger
 * /table-of-akun/{id}:
 *   get:
 *     summary: Detail Akun by ID
 *     tags: [Table Of Akun]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Akun
 *     responses:
 *       200:
 *         description: Detail Akun
 */
router.get("/:id", tableOfAkunController.detailTableOfAkun);

/**
 * @swagger
 * /table-of-akun/{id}:
 *   delete:
 *     summary: Hapus Akun
 *     tags: [Table Of Akun]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Akun
 *     responses:
 *       200:
 *         description: Akun berhasil dihapus
 */
router.delete("/:id", tableOfAkunController.deleteTableOfAkun);

module.exports = router;
