const config = {
  env: process.env.NODE_ENV || 'development',
  debug: process.env.APP_DEBUG === "true",
  getDatabaseConfig: () => ({
    database: "db_kirk3_123",
    username: "kirk_user",
    password: "N33d154yM0r3?",
    host: "127.0.0.1",
    // database: process.env.DB_DATABASE,
    // username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // host: process.env.DB_HOST,
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT || "3306"),
  }),
};

export default config;
