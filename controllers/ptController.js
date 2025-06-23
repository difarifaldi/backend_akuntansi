const Pt = require("../models/pt");

// CREATE PT
exports.createPt = async (req, res) => {
  try {
    const pt = await Pt.create({
      nama_pt: req.body.nama_pt,
      keterangan: req.body.keterangan,
    });

    res.status(201).json({
      message: "Berhasil menambahkan PT",
      data: pt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SHOW ALL PT
exports.showAllPt = async (req, res) => {
  const types = await Pt.findAll();
  res.json(types);
};

// SHOW DETAIL PT
exports.detailPt = async (req, res) => {
  const pt = await Pt.findByPk(req.params.id);
  if (!pt) return res.status(404).json({ message: "PT tidak ditemukan" });
  res.json(pt);
};

// UPDATE PT
exports.updatePt = async (req, res) => {
  try {
    const pt = await Pt.findByPk(req.params.id);
    if (!pt) return res.status(404).json({ message: "PT tidak ditemukan" });

    const updatedData = {
      nama_pt: req.body.nama_pt,
      keterangan: req.body.keterangan,
    };

    await pt.update(updatedData);

    res.status(200).json({
      message: "Berhasil mengubah PT",
      data: pt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE PT
exports.deletePt = async (req, res) => {
  const pt = await Pt.findByPk(req.params.id);
  if (!pt) return res.status(404).json({ message: "PT tidak ditemukan" });
  await Pt.destroy();
  res.status(200).json({ message: "Berhasil Menghapus PT" });
};
