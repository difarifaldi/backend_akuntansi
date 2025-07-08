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
      { expiresIn: "24h" } // token berlaku 24 jam
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

// GET /auth/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "nama", "username", "email", "no_hp", "role", "hint"],
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const updatedData = {};
    if (req.body.nama) updatedData.nama = req.body.nama;
    if (req.body.email) updatedData.email = req.body.email;
    if (req.body.username) updatedData.username = req.body.username;
    if (req.body.no_hp) updatedData.no_hp = req.body.no_hp;
    if (req.body.hint) updatedData.hint = req.body.hint;

    // Hanya admin boleh ubah role
    if (req.body.role && req.user.role === "admin") {
      updatedData.role = req.body.role;
    }

    // Update password jika dikirim
    if (req.body.password && req.body.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updatedData.password = hashedPassword;
      updatedData.password_plain_text = req.body.password;
    }

    await user.update(updatedData);

    res.status(200).json({
      message: "Berhasil mengubah profil",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
