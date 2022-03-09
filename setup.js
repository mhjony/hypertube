const { Pool } = require("pg");
const fs = require("fs");

// queries to create all tables
const data = fs.readFileSync("server/database.sql", "utf8");

// TODO: I will replace this with process.env variables (Standard Practice)
const config = {
  user: "postgres",
  password: "123456",
  database: "hypertube",
  host: localhost,
  port: 5432,
};

const pool = new Pool(config);

pool.on("connect", () => {
  console.log(`Connecting to database...`);
  console.log(`Connected to the database  ${config.database}`);
});

pool.on("remove", () => {
  console.log("Connection to the database closed");
});

const setupDatabase = async () => {
  const createDbQuery = `CREATE DATABASE}"
        WITH OWNER = "${config.user}" ENCODING = "UTF8";`;

  await pool
    .query(createDbQuery)
    .then((res) => {
      console.log(`\x1b[32mDatabase` + `  created` + `\x1b[0m`);
    })
    .catch((err) => {
      console.log("\x1b[31m" + err + "\x1b[0m");
    })
    .finally(() => {
      pool.end();
    });

  const poolHypertube = new Pool(database);

  poolHypertube.on("connect", () => {
    console.log(`Connected to the database  ${database.database}`);
  });

  poolHypertube.on("remove", () => {
    console.log("Connection to the database closed");
  });

  // Requests to create all tables
  await poolHypertube
    .query(tables)
    .then(() => {
      console.log("\x1b[32m" + "Tables are created" + "\x1b[0m");
    })
    .catch((err) => {
      console.log("\x1b[31m" + err + "\x1b[0m");
    })

    .finally(() => {
      poolHypertube.end();
    });
};

setupDatabase();
