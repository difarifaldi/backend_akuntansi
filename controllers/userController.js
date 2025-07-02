const bcrypt = require("bcryptjs");
const User = require("../models/user");

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      nama: req.body.nama,
      email: req.body.email,
      username: req.body.username,
      no_hp: req.body.no_hp,
      role: req.body.role,
      password: hashedPassword,
      password_plain_text: req.body.password,
    });

    res.status(201).json({
      message: "Berhasil menambahkan user",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SHOW ALL USER
exports.showAllUser = async (req, res) => {
  const users = await User.findAll({ order: [["createdAt", "DESC"]] });
  res.json(users);
};

// SHOW DETAIL USER
exports.detailUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const updatedData = {
      nama: req.body.nama,
      email: req.body.email,
      username: req.body.username,
      no_hp: req.body.no_hp,
      role: req.body.role,
    };

    // Jika password dikirim, hash dulu
    if (req.body.password && req.body.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updatedData.password = hashedPassword;
      updatedData.password_plain_text = req.body.password;
    }

    await user.update(updatedData);

    res.status(200).json({
      message: "Berhasil mengubah user",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await user.destroy();
  res.status(200).json({ message: "Berhasil Menghapus User" });
};
