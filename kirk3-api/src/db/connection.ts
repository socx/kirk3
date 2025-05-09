import { Sequelize } from "sequelize-typescript";

import config from "./config";

import { UserKirk } from "./models/userModel"

const sequelize = new Sequelize({
  dialect: "mysql",
  host: config.db.host,
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  logging: false,
  models: [UserKirk],
});

// const sequelize = new Sequelize(
//   config.db.database,
//   config.db.user,
//   config.db.password,
//   {
//     host: config.db.host,
//     dialect: 'mysql'
//   }
// );

export default sequelize;
