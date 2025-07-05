const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { Op, fn, col, where } = require("sequelize");

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

//Show All User
exports.showAllUser = async (req, res) => {
  try {
    const { nama, email, username, no_hp, role } = req.query;

    const andConditions = [];

    if (nama) {
      andConditions.push(
        where(fn("LOWER", col("nama")), {
          [Op.like]: `%${nama.toLowerCase()}%`,
        })
      );
    }

    if (email) {
      andConditions.push({
        email: { [Op.like]: `%${email}%` },
      });
    }

    if (username) {
      andConditions.push({
        username: { [Op.like]: `%${username}%` },
      });
    }

    if (no_hp) {
      andConditions.push({
        no_hp: { [Op.like]: `%${no_hp}%` },
      });
    }

    if (role) {
      andConditions.push({
        role: role,
      });
    }

    const whereClause = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

    const users = await User.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
