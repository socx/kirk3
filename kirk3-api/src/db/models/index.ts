import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config.js')[env];

const  sequelize = process.env.API_BASE_URI as string
  ? new Sequelize(process.env.API_BASE_URI as string, config)
  : new Sequelize(
    process.env.DB_DATABASE as string,
    process.env.DB_USERNAME as string,
    process.env.DB_PASSWORD as string,
    config
  );

export { Sequelize, sequelize };
