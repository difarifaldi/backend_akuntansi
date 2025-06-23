const { body } = require("express-validator");

exports.createTableOfAkunValidator = [
  body("no_akun").notEmpty().withMessage("Nomor akun wajib diisi"),
  body("nama_akun").notEmpty().withMessage("Nama akun wajib diisi"),
  body("id_tipe_akun").notEmpty().withMessage("Tipe akun wajib dipilih").isInt({ gt: 0 }).withMessage("ID tipe akun harus berupa angka lebih dari 0"),
];

exports.updateTableOfAkunValidator = [
  body("no_akun").notEmpty().withMessage("Nomor akun wajib diisi"),
  body("nama_akun").notEmpty().withMessage("Nama akun wajib diisi"),
  body("id_tipe_akun").notEmpty().withMessage("Tipe akun wajib dipilih").isInt({ gt: 0 }).withMessage("ID tipe akun harus berupa angka lebih dari 0"),
];
