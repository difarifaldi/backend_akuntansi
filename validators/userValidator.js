const { body } = require("express-validator");
const User = require("../models/user");

exports.createUserValidator = [
  body("nama").notEmpty().withMessage("Nama wajib diisi").isAlpha("en-US", { ignore: " " }).withMessage("Nama hanya boleh huruf dan spasi"),

  body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("Email sudah terdaftar");
      }
      return true;
    }),
  body("username")
    .notEmpty()
    .withMessage("Username wajib diisi")
    .custom(async (value) => {
      const user = await User.findOne({ where: { username: value } });
      if (user) {
        throw new Error("Username sudah terdaftar");
      }
      return true;
    }),

  body("password").notEmpty().withMessage("Password wajib diisi").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),

  body("role").notEmpty().withMessage("Role wajib diisi"),

  body("no_hp").notEmpty().withMessage("Nomor HP wajib diisi").isNumeric().withMessage("Nomor HP hanya boleh berisi angka").isLength({ min: 10 }).withMessage("Nomor HP Minimal 10 Angka"),
];

exports.updateUserValidator = [
  body("nama").notEmpty().withMessage("Nama wajib diisi").isAlpha("en-US", { ignore: " " }).withMessage("Nama hanya boleh huruf dan spasi"),

  body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Format email Minimal 10 Angka")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { email: value } });

      // Jika ada user dengan email tersebut dan ID-nya bukan milik user yang sedang diedit
      if (user && user.id !== parseInt(req.params.id)) {
        throw new Error("Email sudah terdaftar");
      }

      return true;
    }),

  body("username")
    .notEmpty()
    .withMessage("Username wajib diisi")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { username: value } });

      // Jika ada user dengan username tersebut dan ID-nya bukan milik user yang sedang diedit
      if (user && user.id !== parseInt(req.params.id)) {
        throw new Error("Username sudah terdaftar");
      }

      return true;
    }),

  body("role").notEmpty().withMessage("Role wajib diisi"),

  body("no_hp").notEmpty().withMessage("Nomor HP wajib diisi").isNumeric().withMessage("Nomor HP hanya boleh berisi angka").isLength({ min: 10 }).withMessage("Nomor HP Tidak Valid"),

  body("password")
    .optional() // password boleh tidak diubah
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
];
