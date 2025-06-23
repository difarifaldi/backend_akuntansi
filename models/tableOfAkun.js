const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const TipeAkun = require("./tipeAkun");  // supaya bisa bikin relasi FK

const TableOfAkun = sequelize.define(
  "TableOfAkun",
  {
    no_akun: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_akun: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_tipe_akun: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TipeAkun,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",  // atau CASCADE
    },
  },
  {
    timestamps: true,
  }
);

module.exports = TableOfAkun;
