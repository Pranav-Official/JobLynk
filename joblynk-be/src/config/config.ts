import dotenv from "dotenv";

dotenv.config();

const config = {
  database: {
    dialect: process.env.DB_DIALECT || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "express_sequelize_db",
  },
  app: {
    port: parseInt(process.env.APP_PORT || "8080", 10),
  },
};

export default config;
