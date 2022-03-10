//www.npmjs.com/package/pg-pool
// import Pool from "pg-pool";
import pkg from "pg";
const { Pool } = pkg;

import dotenv from "dotenv";

const pool = new Pool({
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || 123456,
  database: process.env.DB_NAME || "hypertube",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
});

pool.on("connection", (connection) => {
  connection.on("error", (error) => {
    console.error("Database error:", error.message);
  });
});

export default pool;
