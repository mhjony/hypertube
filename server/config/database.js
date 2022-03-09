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

module.exports = pool;
