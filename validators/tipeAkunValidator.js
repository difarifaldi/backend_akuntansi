const { body } = require("express-validator");

exports.createTipeAkunValidator = [body("nama_tipe").notEmpty().withMessage("Nama wajib diisi"), body("no_tipe").notEmpty().withMessage("Nomor tipe wajib diisi")];

exports.updateTipeAkunValidator = [body("nama_tipe").notEmpty().withMessage("Nama wajib diisi"), body("no_tipe").notEmpty().withMessage("Nomor tipe wajib diisi")];
