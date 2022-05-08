//const pool = require('./config/database.js')
const fs = require('fs');
 const { db } = require('./config/database.js');
// queries to create all tables
const database = fs.readFileSync('database.sql', 'utf8');
//const data = fs.readFileSync('config/data.sql', 'utf8');
//const triggers = fs.readFileSync('config/triggers.sql', 'utf8');

// const config = db;

//const pool = new Pool(config);

const app_config = require('./config/app')
const Pool = require("pg").Pool;

/* const pool_matcha = new Pool({
  host: config.appDbHost,
  user: config.appDbUser,
  password: config.appDbPass,
  port: 5432,
  database: 'postgres'
}); */

const config = {
  database: 'postgres',
  password: database.password,
  host: app_config.appDbHost,
  user: app_config.appDbUser,
  password: app_config.appDbPass,
};
const pool_create = new Pool(config);

pool_create.on('connect', () => {
    console.log(`Connected to the database postgres`);
});

pool_create.on('remove', () => {
    console.log('Connection to the database closed');
});

const setupDatabase = async () => {
    const createDbQuery = `CREATE DATABASE matcha
        WITH OWNER = "postgres" ENCODING = "UTF8";`;

    await pool_create
        .query(createDbQuery)
        .then((res) => {
            console.log(`\x1b[32mDatabase` + ` matcha created` + `\x1b[0m`);
        })
        .catch((err) => {
            console.log('\x1b[31m' + err + '\x1b[0m');
        })
        .finally(() => {
          pool_create.end();
        });
    const poolMatcha = new Pool({
      host: app_config.appDbHost,
      user: app_config.appDbUser,
      password: app_config.appDbPass,
      port: 5432,
      database: 'matcha'
    });

    poolMatcha.on('connect', () => {
        console.log(`Connected to the database matcha`);
    });

    poolMatcha.on('remove', () => {
        console.log('Connection to the database closed');
    });

    await poolMatcha
        .query(database)
        .then(() => {
            console.log('\x1b[32m' + 'Tables are created' + '\x1b[0m');
        })
        .catch((err) => {
            console.log('\x1b[31m' + err + '\x1b[0m');
        })
        .finally(() => {
            poolMatcha.end();
        });
};

setupDatabase();