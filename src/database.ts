import knex from 'knex';

const knexConfig = require('../knexfile'); 

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

export default knex(config);