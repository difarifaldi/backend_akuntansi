const { body } = require("express-validator");

exports.loginValidator = [body("username").notEmpty().withMessage("Username wajib diisi"), body("password").notEmpty().withMessage("Password wajib diisi")];
