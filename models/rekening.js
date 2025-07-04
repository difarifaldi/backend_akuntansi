const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Pt = require("./pt"); // supaya bisa bikin relasi FK

const Rekening = sequelize.define(
  "Rekening",
  {
    no_rekening: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_rekening: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mata_uang: {
      type: DataTypes.STRING(3), // ISO 4217: "IDR", "USD"
      allowNull: true,
    },
    total_saldo: {
      type: DataTypes.DECIMAL(20, 2),
      defaultValue: 0,
    },
    id_pt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pt,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT", // atau CASCADE
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Rekening;
