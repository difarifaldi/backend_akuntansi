const { body } = require("express-validator");

exports.createRekeningValidator = [
  body("no_rekening").notEmpty().withMessage("Nomor rekening wajib diisi"),
  body("nama_rekening").notEmpty().withMessage("Nama rekening wajib diisi"),
  body("id_pt").notEmpty().withMessage("PT wajib dipilih").isInt({ gt: 0 }).withMessage("ID PT harus berupa angka lebih dari 0"),
  body("mata_uang").notEmpty().withMessage("Mata uang wajib diisi").isLength({ min: 3, max: 3 }).withMessage("Mata uang harus 3 huruf, contoh: IDR, USD"),
];

exports.updateRekeningValidator = [
  body("no_rekening").notEmpty().withMessage("Nomor rekening wajib diisi"),
  body("nama_rekening").notEmpty().withMessage("Nama rekening wajib diisi"),
  body("id_pt").notEmpty().withMessage("PT wajib dipilih").isInt({ gt: 0 }).withMessage("ID PT harus berupa angka lebih dari 0"),
  body("mata_uang").optional().isLength({ min: 3, max: 3 }).withMessage("Mata uang harus 3 huruf, contoh: IDR, USD"),
];
