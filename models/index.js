const TipeAkun = require("./tipeAkun");
const TableOfAkun = require("./tableOfAkun");
const Pt = require("./pt");
const Rekening = require("./rekening");
const User = require("./user");
const Transaksi = require("./transaksi");

// Setup association Tipe Akun <-> Table Of Akun
TipeAkun.hasMany(TableOfAkun, { foreignKey: "id_tipe_akun" });
TableOfAkun.belongsTo(TipeAkun, { foreignKey: "id_tipe_akun" });

// Setup association PT <-> Rekening
Pt.hasMany(Rekening, { foreignKey: "id_pt" });
Rekening.belongsTo(Pt, { foreignKey: "id_pt" });

// Setup association TableOfAkun <-> Transaksi
TableOfAkun.hasMany(Transaksi, { foreignKey: "id_table_of_akun" });
Transaksi.belongsTo(TableOfAkun, { foreignKey: "id_table_of_akun" });

// Setup association Rekening <-> Transaksi
Rekening.hasMany(Transaksi, { foreignKey: "id_rekening" });
Transaksi.belongsTo(Rekening, { foreignKey: "id_rekening" });

// Setup association User <-> Transaksi
User.hasMany(Transaksi, { foreignKey: "created_by" });
Transaksi.belongsTo(User, { foreignKey: "created_by" });

module.exports = {
  TipeAkun,
  TableOfAkun,
  Pt,
  Rekening,
  User,
  Transaksi,
};
