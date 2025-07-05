const TipeAkun = require("../models/tipeAkun");
const { Op, fn, col, where } = require("sequelize");
// CREATE Tipe Akun
exports.createTipeAkun = async (req, res) => {
  try {
    const tipeAkun = await TipeAkun.create({
      nama_tipe: req.body.nama_tipe,
      no_tipe: req.body.no_tipe,
    });

    res.status(201).json({
      message: "Berhasil menambahkan tipe akun",
      data: tipeAkun,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SHOW ALL Tipe Akun
exports.showAllTipeAkun = async (req, res) => {
  try {
    const { nama_tipe, no_tipe } = req.query;
    const andConditions = [];

    if (nama_tipe) {
      andConditions.push(
        where(fn("LOWER", col("nama_tipe")), {
          [Op.like]: `%${nama_tipe.toLowerCase()}%`,
        })
      );
    }

    if (no_tipe) {
      andConditions.push({
        no_tipe: { [Op.like]: `%${no_tipe}%` },
      });
    }

    const whereClause = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

    const types = await TipeAkun.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    res.json(types);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SHOW DETAIL Tipe Akun
exports.detailTipeAkun = async (req, res) => {
  const tipeAkun = await TipeAkun.findByPk(req.params.id);
  if (!tipeAkun) return res.status(404).json({ message: "Tipe akun tidak ditemukan" });
  res.json(tipeAkun);
};

// UPDATE Tipe Akun
exports.updateTipeAkun = async (req, res) => {
  try {
    const tipeAkun = await TipeAkun.findByPk(req.params.id);
    if (!tipeAkun) return res.status(404).json({ message: "Tipe akun tidak ditemukan" });

    const updatedData = {
      nama_tipe: req.body.nama_tipe,
      no_tipe: req.body.no_tipe,
    };

    await tipeAkun.update(updatedData);

    res.status(200).json({
      message: "Berhasil mengubah tipe akun",
      data: tipeAkun,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Tipe Akun
exports.deleteTipeAkun = async (req, res) => {
  const tipeAkun = await TipeAkun.findByPk(req.params.id);
  if (!tipeAkun) return res.status(404).json({ message: "Tipe akun tidak ditemukan" });
  await tipeAkun.destroy();
  res.status(200).json({ message: "Berhasil Menghapus Tipe Akun" });
};
