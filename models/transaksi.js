const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const TableOfAkun = require("./tableOfAkun");
const Rekening = require("./rekening");
const User = require("./user");

const Transaksi = sequelize.define(
  "Transaksi",
  {
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    id_table_of_akun: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TableOfAkun,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    debit: {
      type: DataTypes.DECIMAL(20, 2), // pakai DECIMAL untuk akurat
      defaultValue: 0,
    },
    kredit: {
      type: DataTypes.DECIMAL(20, 2),
      defaultValue: 0,
    },
    saldo: {
      type: DataTypes.DECIMAL(20, 2),
      defaultValue: 0,
    },
    id_rekening: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Rekening,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    mata_uang: {
      type: DataTypes.STRING(3), // ISO 4217: "IDR", "USD"
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Transaksi;
