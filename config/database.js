const { Sequelize } = require("sequelize");

const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // supaya jalan di Railway
    },
  },
});

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database updated"))
  .catch((err) => console.error("Sync error:", err));

module.exports = sequelize;
