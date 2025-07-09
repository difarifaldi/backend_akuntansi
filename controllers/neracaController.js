const Transaksi = require("../models/transaksi");
const TableOfAkun = require("../models/tableOfAkun");
const TipeAkun = require("../models/tipeAkun");
const Rekening = require("../models/rekening");
const { Op, fn, col, where } = require("sequelize");
const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const { getNeracaData } = require("../services/neracaServices");

exports.laporanNeraca = async (req, res) => {
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

    const hasil = {};
    transaksi.forEach((trx) => {
      const tipe = trx?.TableOfAkun?.TipeAkun?.nama_tipe;
      const akun = trx?.TableOfAkun?.nama_akun;

      if (!tipe | !akun) return;

      if (!hasil[tipe]) {
        hasil[tipe] = {
          akun: {},
          total_debit: 0,
          total_kredit: 0,
        };
      }

      if (!hasil[tipe].akun[akun]) {
        hasil[tipe].akun[akun] = {
          debit: 0,
          kredit: 0,
        };
      }
      hasil[tipe].akun[akun].debit += parseFloat(trx.debit || 0);
      hasil[tipe].akun[akun].kredit += parseFloat(trx.kredit || 0);

      hasil[tipe].total_debit += parseFloat(trx.debit || 0);
      hasil[tipe].total_kredit += parseFloat(trx.kredit || 0);
    });

    res.json({
      filter: {
        start_tanggal,
        end_tanggal,
        id_rekening,
        mata_uang,
      },
      hasil,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportNeracaPDF = async (req, res) => {
  try {
    const filters = req.query;
    const data = await getNeracaData(filters);

    const dataRekening = await Rekening.findByPk(filters.id_rekening);
    const html = await ejs.renderFile(path.join(__dirname, "../views/neraca.ejs"), {
      start_tanggal: filters.start_tanggal || "-",
      end_tanggal: filters.end_tanggal || "-",
      mata_uang: filters.mata_uang || "-",
      data_rekening: dataRekening || "-",
      data,
    });

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    const filename = `Laba-rugi_${dataRekening?.nama_rekening || ""}_${filters.start_tanggal || "awal"}_${filters.end_tanggal || "akhir"}.pdf`;
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${filename}`,
    });

    res.send(pdf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
