const Rekening = require("../models/rekening");
const Pt = require("../models/pt");

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
    const accounts = await Rekening.findAll({
      include: [{ model: Pt }],
      order: [["createdAt", "DESC"]], // biar bisa lihat pt juga
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
