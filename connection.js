const knex = require('knex');

const config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 7 }
};

const db = knex(config);

module.exports = db;
