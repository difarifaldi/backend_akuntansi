const Rekening = require("../models/rekening");
const Pt = require("../models/pt");
const { Op, fn, col, where } = require("sequelize");

// CREATE rekening
exports.createRekening = async (req, res) => {
  try {
    const createRekening = await Rekening.create({
      no_rekening: req.body.no_rekening,
      nama_rekening: req.body.nama_rekening,
      id_pt: req.body.id_pt,
      mata_uang: req.body.mata_uang,
    });

    res.status(201).json({
      message: "Berhasil menambahkan rekening",
      data: createRekening,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SHOW ALL rekening
exports.showAllRekening = async (req, res) => {
  try {
    const { no_rekening, nama_rekening, id_pt, mata_uang } = req.query;
    const andConditions = [];

    if (no_rekening) {
      andConditions.push({
        no_rekening: {
          [Op.like]: `%${no_rekening}%`,
        },
      });
    }

    if (nama_rekening) {
      andConditions.push(
        where(fn("LOWER", col("nama_rekening")), {
          [Op.like]: `%${nama_rekening.toLowerCase()}%`,
        })
      );
    }

    if (id_pt) {
      andConditions.push({ id_pt });
    }

    if (mata_uang) {
      andConditions.push({
        mata_uang: {
          [Op.like]: `%${mata_uang}%`,
        },
      });
    }

    const whereClause = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

    const accounts = await Rekening.findAll({
      where: whereClause,
      include: [{ model: Pt }],
      order: [["createdAt", "DESC"]],
    });

    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SHOW DETAIL rekening
exports.detailRekening = async (req, res) => {
  try {
    const account = await Rekening.findByPk(req.params.id, {
      include: [{ model: Pt }],
    });

    if (!account) return res.status(404).json({ message: "rekening tidak ditemukan" });

    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE rekening
exports.updateRekening = async (req, res) => {
  try {
    const account = await Rekening.findByPk(req.params.id);
    if (!account) return res.status(404).json({ message: "rekening tidak ditemukan" });

    const updatedData = {
      no_rekening: req.body.no_rekening,
      nama_rekening: req.body.nama_rekening,
      id_pt: req.body.id_pt,
      mata_uang: req.body.mata_uang,
    };

    await account.update(updatedData);

    res.status(200).json({
      message: "Berhasil mengubah rekening",
      data: account,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE rekening
exports.deleteRekening = async (req, res) => {
  try {
    const account = await Rekening.findByPk(req.params.id);
    if (!account) return res.status(404).json({ message: "rekening tidak ditemukan" });

    await account.destroy();

    res.status(200).json({ message: "Berhasil Menghapus rekening" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
