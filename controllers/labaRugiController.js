const Transaksi = require("../models/transaksi");
const TableOfAkun = require("../models/tableOfAkun");
const TipeAkun = require("../models/tipeAkun");
const Rekening = require("../models/rekening");
const { Op, fn, col, where } = require("sequelize");
const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const { getLabaRugiData } = require("../services/labaRugiServices");

exports.laporanLabaRugi = async (req, res) => {
  try {
    const { start_tanggal, end_tanggal, id_rekening, mata_uang } = req.query;

    // Siapkan kondisi where transaksi
    const whereClause = {};

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

    if (id_rekening) {
      whereClause.id_rekening = id_rekening;
    }

    // Siapkan include Rekening dengan filter mata_uang
    const include = [
      {
        model: TableOfAkun,
        include: [{ model: TipeAkun }],
      },
      {
        model: Rekening,
        where: mata_uang
          ? where(fn("LOWER", col("Rekening.mata_uang")), {
              [Op.like]: mata_uang.toLowerCase(),
            })
          : undefined,
      },
    ];

    const transaksi = await Transaksi.findAll({
      where: whereClause,
      include,
      order: [["tanggal", "ASC"]],
    });

    const hasil = {
      debit: {},
      kredit: {},
    };

    transaksi.forEach((trx) => {
      const namaTipe = trx?.TableOfAkun?.TipeAkun?.nama_tipe;
      if (!namaTipe) return;

      if (parseFloat(trx.debit) > 0) {
        if (!hasil.debit[namaTipe]) hasil.debit[namaTipe] = [];
        hasil.debit[namaTipe].push(trx);
      }

      if (parseFloat(trx.kredit) > 0) {
        if (!hasil.kredit[namaTipe]) hasil.kredit[namaTipe] = [];
        hasil.kredit[namaTipe].push(trx);
      }
    });

    const total = {
      debit: {},
      kredit: {},
    };

    for (const tipe in hasil.debit) {
      total.debit[tipe] = hasil.debit[tipe].reduce((sum, trx) => sum + parseFloat(trx.debit), 0);
    }

    for (const tipe in hasil.kredit) {
      total.kredit[tipe] = hasil.kredit[tipe].reduce((sum, trx) => sum + parseFloat(trx.kredit), 0);
    }

    const totalPendapatan = Object.values(total.kredit).reduce((sum, val) => sum + val, 0);
    const totalBeban = Object.values(total.debit).reduce((sum, val) => sum + val, 0);
    const labaRugi = totalPendapatan - totalBeban;

    res.json({
      filter: {
        start_tanggal,
        end_tanggal,
        id_rekening,
        mata_uang,
      },
      hasil,
      total,
      totalPendapatan,
      totalBeban,
      labaRugi,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportLabaRugiPDF = async (req, res) => {
  try {
    const filters = req.query;
    const data = await getLabaRugiData(filters);

    const html = await ejs.renderFile(path.join(__dirname, "../views/laba-rugi.ejs"), {
      start_tanggal: filters.start_tanggal || "-",
      end_tanggal: filters.end_tanggal || "-",
      mata_uang: filters.mata_uang || "-",
      data,
    });

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=laba-rugi.pdf",
    });

    res.send(pdf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
