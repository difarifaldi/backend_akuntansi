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
