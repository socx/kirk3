require('ts-node/register');
// const configs = require('../configs.ts');

module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: 3306
};
