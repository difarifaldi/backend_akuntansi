const TableOfAkun = require("../models/tableOfAkun");
const TipeAkun = require("../models/tipeAkun");

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
    const accounts = await TableOfAkun.findAll({
      include: [{ model: TipeAkun }],
      order: [["createdAt", "DESC"]], // biar bisa lihat tipe akun juga
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
