const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const pt = sequelize.define(
  "pt",
  {
    nama_pt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = pt;
