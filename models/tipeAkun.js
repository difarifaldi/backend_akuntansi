const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TipeAkun = sequelize.define(
  "TipeAkun",
  {
    nama_tipe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_tipe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = TipeAkun;
