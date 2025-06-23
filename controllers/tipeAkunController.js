const TipeAkun = require("../models/tipeAkun");

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
  const types = await TipeAkun.findAll();
  res.json(types);
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
