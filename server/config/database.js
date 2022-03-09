require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
  username: process.env.DB_USERNAME || postgres,
  password: process.env.DB_PASSWORD || 123456,
  database: process.env.DB_NAME || hypertube,
  host: process.env.DB_HOST || localhost,
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
});

pool.getConnection((err) => {
  console.info("Connected to PostgresSQL");
  if (err) {
    console.error("Error connecting to PostgresSQL", err.message);
  }
});

pool.on("connection", (connection) => {
  connection.on("error", (error) => {
    console.error("Database error:", error.message);
  });
});

module.exports = pool;
