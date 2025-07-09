const { Transaksi, TableOfAkun, Rekening, TipeAkun } = require("../models");
const { Op, fn, col, where } = require("sequelize");

exports.getNeracaData = async (filters) => {
  const { id_rekening, start_tanggal, end_tanggal, mata_uang } = filters;

  const whereClause = {};

  if (id_rekening) {
    whereClause.id_rekening = id_rekening;
  }

  if (start_tanggal && end_tanggal) {
    whereClause.tanggal = { [Op.between]: [start_tanggal, end_tanggal] };
  } else if (start_tanggal) {
    whereClause.tanggal = { [Op.gte]: start_tanggal };
  } else if (end_tanggal) {
    whereClause.tanggal = { [Op.lte]: end_tanggal };
  }

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
    const tipe = trx.TableOfAkun?.TipeAkun?.nama_tipe || "Lainnya";
    const akun = trx.TableOfAkun?.nama_akun || "Lainnya";

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

    hasil[tipe].akun[akun].kredit += parseFloat(trx.kredit || 0);
    hasil[tipe].akun[akun].debit += parseFloat(trx.debit || 0);

    hasil[tipe].total_kredit += parseFloat(trx.kredit || 0);
    hasil[tipe].total_debit += parseFloat(trx.debit || 0);
  });

  return hasil;
};
