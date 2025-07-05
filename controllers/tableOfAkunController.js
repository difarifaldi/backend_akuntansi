const TableOfAkun = require("../models/tableOfAkun");
const TipeAkun = require("../models/tipeAkun");
const { Op, fn, col, where } = require("sequelize");

// CREATE Table Of Akun
exports.createTableOfAkun = async (req, res) => {
  try {
    const tableOfAkun = await TableOfAkun.create({
      no_akun: req.body.no_akun,
      nama_akun: req.body.nama_akun,
      id_tipe_akun: req.body.id_tipe_akun,
    });

    res.status(201).json({
      message: "Berhasil menambahkan akun",
      data: tableOfAkun,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SHOW ALL Table Of Akun
exports.showAllTableOfAkun = async (req, res) => {
  try {
    const { no_akun, nama_akun, id_tipe_akun } = req.query;
    const andConditions = [];

    if (no_akun) {
      andConditions.push({
        no_akun: {
          [Op.like]: `%${no_akun}%`,
        },
      });
    }

    if (nama_akun) {
      andConditions.push(
        where(fn("LOWER", col("nama_akun")), {
          [Op.like]: `%${nama_akun.toLowerCase()}%`,
        })
      );
    }

    if (id_tipe_akun) {
      andConditions.push({ id_tipe_akun });
    }

    const whereClause = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

    const accounts = await TableOfAkun.findAll({
      where: whereClause,
      include: [{ model: TipeAkun }],
      order: [["createdAt", "DESC"]],
    });

    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// SHOW DETAIL Table Of Akun
exports.detailTableOfAkun = async (req, res) => {
  try {
    const account = await TableOfAkun.findByPk(req.params.id, {
      include: [{ model: TipeAkun }],
    });

    if (!account) return res.status(404).json({ message: "Akun tidak ditemukan" });

    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE Table Of Akun
exports.updateTableOfAkun = async (req, res) => {
  try {
    const account = await TableOfAkun.findByPk(req.params.id);
    if (!account) return res.status(404).json({ message: "Akun tidak ditemukan" });

    const updatedData = {
      no_akun: req.body.no_akun,
      nama_akun: req.body.nama_akun,
      id_tipe_akun: req.body.id_tipe_akun,
    };

    await account.update(updatedData);

    res.status(200).json({
      message: "Berhasil mengubah akun",
      data: account,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Table Of Akun
exports.deleteTableOfAkun = async (req, res) => {
  try {
    const account = await TableOfAkun.findByPk(req.params.id);
    if (!account) return res.status(404).json({ message: "Akun tidak ditemukan" });

    await account.destroy();

    res.status(200).json({ message: "Berhasil Menghapus Akun" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
