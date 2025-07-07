const { Transaksi, TableOfAkun, Rekening, TipeAkun } = require("../models");
const { Op, fn, col, where } = require("sequelize");

exports.getLabaRugiData = async (filters) => {
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

  const grouped = {
    debit: {},
    kredit: {},
    total_debit: 0,
    total_kredit: 0,
  };

  transaksi.forEach((trx) => {
    const tipe = trx.TableOfAkun?.TipeAkun?.nama_tipe || "Lainnya";
    const debit = parseFloat(trx.debit || 0);
    const kredit = parseFloat(trx.kredit || 0);

    if (debit > 0) {
      grouped.debit[tipe] = (grouped.debit[tipe] || 0) + debit;
      grouped.total_debit += debit;
    }

    if (kredit > 0) {
      grouped.kredit[tipe] = (grouped.kredit[tipe] || 0) + kredit;
      grouped.total_kredit += kredit;
    }
  });

  return grouped;
};
