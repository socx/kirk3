import mysql from "mysql2/promise";
import config from "./config";

async function query(sql:string, params?:any) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.query(sql, params);
  return results;
}
 
export default  {
  query,
};


//connection.ts
// import { Sequelize } from 'sequelize';

// let sequelizeConnection: Sequelize = new Sequelize(
//   process.env.DB_DATABASE as string,
//   process.env.DB_USERNAME as string,
//   process.env.DB_PASSWORD as string,
//   {
//   host: process.env.DB_HOST as string,
//   dialect: 'mysql',
//   port: 3306, 
// });

// export default sequelizeConnection;




//sequelize.config.js
// require('ts-node/register');
// // const configs = require('../configs.ts');

// module.exports = {
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   host: process.env.DB_HOST,
//   dialect: 'mysql',
//   port: 3306
// };


// Creating models
// npx sequelize-cli model:generate --name User --attributes fullname:string,email:string,password:string
