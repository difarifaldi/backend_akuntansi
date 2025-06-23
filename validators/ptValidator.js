const { body } = require("express-validator");

exports.createPtValidator = [body("nama_pt").notEmpty().withMessage("Nama wajib diisi")];

exports.updatePtValidator = [body("nama_pt").notEmpty().withMessage("Nama wajib diisi")];
