const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/database");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

require("./models"); //load relasi

const userRoutes = require("./routes/userRoutes");
const tipeAkunRoutes = require("./routes/tipeAkunRoutes");
const tableOfAkunRoutes = require("./routes/tableOfAkunRoutes");
const ptRoutes = require("./routes/ptRoutes");
const rekeningRoutes = require("./routes/rekeningRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");
const authRoutes = require("./routes/authRoutes");

// aktifkan CORS di semua route
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Project Akuntansi",
      version: "1.0.0",
      description: "Dokumentasi API untuk Project NodeJS Akuntansi",
    },
    servers: [
      {
        url: "http://localhost:3000", // server
      },
    ],
  },
  apis: ["./routes/*.js"], // akses ke semua routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// serve Swagger di /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", userRoutes);
app.use("/tipe-akun", tipeAkunRoutes);
app.use("/table-of-akun", tableOfAkunRoutes);
app.use("/pt", ptRoutes);
app.use("/rekening", rekeningRoutes);
app.use("/transaksi", transaksiRoutes);
app.use("/auth", authRoutes);

// Sync DB
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => console.error(err));

module.exports = app;
