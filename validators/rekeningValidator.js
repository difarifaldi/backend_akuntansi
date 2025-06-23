const { body } = require("express-validator");

exports.createRekeningValidator = [
  body("no_rekening").notEmpty().withMessage("Nomor rekening wajib diisi"),
  body("nama_rekening").notEmpty().withMessage("Nama rekening wajib diisi"),
  body("id_pt").notEmpty().withMessage("PT wajib dipilih").isInt({ gt: 0 }).withMessage("ID PT harus berupa angka lebih dari 0"),
];

exports.updateRekeningValidator = [
  body("no_rekening").notEmpty().withMessage("Nomor rekening wajib diisi"),
  body("nama_rekening").notEmpty().withMessage("Nama rekening wajib diisi"),
  body("id_pt").notEmpty().withMessage("PT wajib dipilih").isInt({ gt: 0 }).withMessage("ID PT harus berupa angka lebih dari 0"),
];
