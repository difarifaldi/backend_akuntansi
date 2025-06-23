const { body } = require("express-validator");

exports.createTransaksiValidator = [
  body("tanggal").notEmpty().withMessage("Tanggal wajib diisi").isDate().withMessage("Tanggal tidak valid"),
  body("id_table_of_akun").notEmpty().withMessage("Table akun wajib diisi").isInt().withMessage("ID table akun harus angka"),
  body("keterangan").notEmpty().withMessage("Keterangan wajib diisi"),
  body("debit").optional().isDecimal({ decimal_digits: "0,2" }).withMessage("Debit harus angka desimal"),
  body("kredit").optional().isDecimal({ decimal_digits: "0,2" }).withMessage("Kredit harus angka desimal"),
  body("saldo").optional().isDecimal({ decimal_digits: "0,2" }).withMessage("Saldo harus angka desimal"),
  body("id_rekening").optional().isInt().withMessage("ID rekening harus angka"),
  body("mata_uang").notEmpty().withMessage("Mata uang wajib diisi").isLength({ min: 3, max: 3 }).withMessage("Mata uang harus 3 huruf, contoh: IDR, USD"),
  body("created_by").notEmpty().withMessage("Created by wajib diisi").isInt().withMessage("Created by harus angka"),
];

exports.updateTransaksiValidator = [
  body("tanggal").optional().isDate().withMessage("Tanggal tidak valid"),
  body("id_table_of_akun").optional().isInt().withMessage("ID table akun harus angka"),
  body("keterangan").optional().notEmpty().withMessage("Keterangan tidak boleh kosong"),
  body("debit").optional().isDecimal({ decimal_digits: "0,2" }).withMessage("Debit harus angka desimal"),
  body("kredit").optional().isDecimal({ decimal_digits: "0,2" }).withMessage("Kredit harus angka desimal"),
  body("saldo").optional().isDecimal({ decimal_digits: "0,2" }).withMessage("Saldo harus angka desimal"),
  body("id_rekening").optional().isInt().withMessage("ID rekening harus angka"),
  body("mata_uang").optional().isLength({ min: 3, max: 3 }).withMessage("Mata uang harus 3 huruf, contoh: IDR, USD"),
  body("created_by").optional().isInt().withMessage("Created by harus angka"),
];
