const Transaksi = require("../models/transaksi");
const TableOfAkun = require("../models/tableOfAkun");
const Rekening = require("../models/rekening");
const User = require("../models/user");
const { Op } = require("sequelize");
const puppeteer = require("puppeteer");

//create rekening
exports.createTransaksi = async (req, res) => {
  try {
    // cari saldo terakhir untuk akun ini
    const lastTransaksi = await Transaksi.findOne({
      where: { id_rekening: req.body.id_rekening },
      order: [
        ["tanggal", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    const saldoTerakhir = lastTransaksi ? parseFloat(lastTransaksi.saldo) : 0;
    const debitBaru = parseFloat(req.body.debit) || 0;
    const kreditBaru = parseFloat(req.body.kredit) || 0;

    const saldoBaru = saldoTerakhir + debitBaru - kreditBaru;

    // buat transaksi baru
    const transaksi = await Transaksi.create({
      tanggal: req.body.tanggal,
      id_table_of_akun: req.body.id_table_of_akun,
      keterangan: req.body.keterangan,
      debit: debitBaru,
      kredit: kreditBaru,
      saldo: saldoBaru,
      id_rekening: req.body.id_rekening || null,
      mata_uang: req.body.mata_uang,
      created_by: req.body.created_by,
    });

    // Ambil semua transaksi dari rekening tsb
    const transaksiAll = await Transaksi.findAll({
      where: { id_rekening: req.body.id_rekening },
    });

    // Hitung ulang total saldo dari semua transaksi
    const totalSaldoSemua = transaksiAll.reduce((total, trx) => {
      return total + parseFloat(trx.debit || 0) - parseFloat(trx.kredit || 0);
    }, 0);

    // 🔧 Ambil rekening-nya dulu
    const rekening = await Rekening.findByPk(req.body.id_rekening);

    // Update total_saldo rekening
    const update_rekening = await rekening.update({
      total_saldo: totalSaldoSemua,
    });

    res.status(201).json({
      message: "Berhasil menambahkan transaksi",
      data: [transaksi, update_rekening],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SHOW ALL Transaksi (dengan filter optional by id_rekening)
exports.showAllTransaksi = async (req, res) => {
  try {
    const { id_rekening, start_tanggal, end_tanggal } = req.query; // ambil dari query param

    // Siapkan where condition
    const whereClause = {};

    if (id_rekening) {
      whereClause.id_rekening = id_rekening;
    }

    if (start_tanggal && end_tanggal) {
      whereClause.tanggal = {
        [Op.between]: [start_tanggal, end_tanggal],
      };
    } else if (start_tanggal) {
      whereClause.tanggal = {
        [Op.gte]: start_tanggal,
      };
    } else if (end_tanggal) {
      whereClause.tanggal = {
        [Op.lte]: end_tanggal,
      };
    }

    const transaksi = await Transaksi.findAll({
      where: whereClause,
      include: [{ model: TableOfAkun }, { model: Rekening }, { model: User, attributes: ["id", "nama", "username"] }],
      order: [
        ["tanggal", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    res.json(transaksi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SHOW DETAIL Transaksi
exports.detailTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.id, {
      include: [{ model: TableOfAkun }, { model: Rekening }, { model: User, attributes: ["id", "name", "username"] }],
    });
    if (!transaksi) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    res.json(transaksi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE Transaksi
exports.updateTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.id);
    if (!transaksi) return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    const rekeningIdLama = transaksi.id_rekening; // ambil rekening lama

    // Update data transaksi
    await transaksi.update({
      tanggal: req.body.tanggal,
      id_table_of_akun: req.body.id_table_of_akun,
      keterangan: req.body.keterangan,
      debit: parseFloat(req.body.debit) || 0,
      kredit: parseFloat(req.body.kredit) || 0,
      id_rekening: req.body.id_rekening,
      mata_uang: req.body.mata_uang,
      created_by: req.body.created_by,
    });

    // Ambil semua transaksi untuk rekening yg baru (bisa rekening baru atau rekening lama)
    const semuaTransaksi = await Transaksi.findAll({
      where: { id_rekening: req.body.id_rekening || rekeningIdLama },
      order: [
        ["tanggal", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    // Rehitung saldo
    let saldo = 0;
    for (const trx of semuaTransaksi) {
      const debit = parseFloat(trx.debit) || 0;
      const kredit = parseFloat(trx.kredit) || 0;

      saldo = saldo + debit - kredit;

      // Update saldo
      await trx.update({ saldo: saldo });
    }

    //  Update total_saldo di Rekening
    const totalSaldoBaru = semuaTransaksi.reduce((total, trx) => {
      return total + parseFloat(trx.debit || 0) - parseFloat(trx.kredit || 0);
    }, 0);

    const rekening = await Rekening.findByPk(req.body.id_rekening || rekeningIdLama);
    await rekening.update({ total_saldo: totalSaldoBaru });

    res.status(200).json({
      message: "Berhasil mengubah transaksi & update saldo Rekening",
      data: transaksi,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Transaksi
exports.deleteTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.id);
    if (!transaksi) return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    const idRekening = transaksi.id_rekening;
    const tanggalTransaksi = transaksi.tanggal;

    // Hapus transaksi
    await transaksi.destroy();

    // Ambil semua transaksi setelah transaksi yg dihapus, urut ASC
    const semuaTransaksi = await Transaksi.findAll({
      where: { id_rekening: idRekening },
      order: [
        ["tanggal", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    // Hitung ulang saldo
    let saldo = 0;
    for (const trx of semuaTransaksi) {
      const debit = parseFloat(trx.debit) || 0;
      const kredit = parseFloat(trx.kredit) || 0;

      saldo = saldo + debit - kredit;

      await trx.update({ saldo: saldo });
    }

    res.status(200).json({ message: "Berhasil menghapus transaksi & update saldo" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Export PDF
exports.exportPDF = async (req, res) => {
  try {
    const { id_rekening, start_tanggal, end_tanggal } = req.query;

    // Siapkan where clause
    const whereClause = {};

    if (id_rekening) {
      whereClause.id_rekening = id_rekening;
    }

    if (start_tanggal && end_tanggal) {
      whereClause.tanggal = {
        [Op.between]: [start_tanggal, end_tanggal],
      };
    } else if (start_tanggal) {
      whereClause.tanggal = {
        [Op.gte]: start_tanggal,
      };
    } else if (end_tanggal) {
      whereClause.tanggal = {
        [Op.lte]: end_tanggal,
      };
    }

    // Ambil data transaksi sesuai filter
    const transaksi = await Transaksi.findAll({
      where: whereClause,
      include: [{ model: TableOfAkun }, { model: Rekening }, { model: User }],
      order: [
        ["tanggal", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    // Generate HTML untuk PDF
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 6px; font-size: 12px; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Laporan Transaksi</h2>
          ${start_tanggal || end_tanggal ? `<p>Periode: ${start_tanggal || "-"} s/d ${end_tanggal || "-"}</p>` : ""}
          ${id_rekening ? `<p>Rekening: ${transaksi[0]?.Rekening?.nama_rekening || "Tidak ditemukan"}</p>` : ""}
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Rekening</th>
                <th>Akun</th>
                <th>Keterangan</th>
                <th>Debit</th>
                <th>Kredit</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              ${
                transaksi.length > 0
                  ? transaksi
                      .map((trx) => {
                        return `
                          <tr>
                            <td>${trx.tanggal}</td>
                            <td>${trx.Rekening?.nama_rekening || "-"}</td>
                            <td>${trx.TableOfAkun?.nama_akun || "-"}</td>
                            <td>${trx.keterangan}</td>
                            <td>${trx.debit}</td>
                            <td>${trx.kredit}</td>
                            <td>${trx.saldo}</td>
                          </tr>
                        `;
                      })
                      .join("")
                  : `<tr><td colspan="7">Tidak ada data</td></tr>`
              }
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Generate PDF dari HTML
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // Kirim PDF ke client
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=laporan-transaksi.pdf",
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
