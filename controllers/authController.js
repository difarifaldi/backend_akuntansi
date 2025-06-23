const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // cari user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    // cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        nama: user.nama,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret", // sebaiknya taruh di .env
      { expiresIn: "12h" } // token berlaku 12 jam
    );

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
