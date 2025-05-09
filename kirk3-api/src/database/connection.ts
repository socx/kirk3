import { Sequelize } from 'sequelize';

let sequelizeConnection: Sequelize = new Sequelize(
  process.env.DB_DATABASE as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
  host: process.env.DB_HOST as string,
  dialect: 'mysql',
  port: 3306, 
});

export default sequelizeConnection;
