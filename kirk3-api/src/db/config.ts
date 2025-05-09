const config = {
  // db: {
  //     host: "localhost",
  //     user: "kirk_user",
  //     password: "N33d154yM0r3?",
  //     database: "db_kirk3_123",
  // },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
},
  port: 80,
  listPerPage: 100
};

export default config;
