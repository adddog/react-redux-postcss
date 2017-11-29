const dotenv = require('dotenv').config();

var multiDb = {};

multiDb.vbdash = require('knex')({
  client: 'pg',
  connection: process.env.db,
  pool: {
    min: 2,
    max: 10
  }
});

multiDb.stageDb = require('knex')({
  client: 'pg',
  connection: process.env.stageDb,
  pool: {
    min: 2,
    max: 10
  }
});

multiDb.prodDb = require('knex')({
  client: 'pg',
  connection: process.env.prodDb,
  pool: {
    min: 2,
    max: 10
  }
});

module.exports = multiDb;
