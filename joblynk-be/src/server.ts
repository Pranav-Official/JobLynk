// src/server.ts
import app from "./app";
import db from "./models";
import config from "./config/config";

const PORT = config.app.port;

const startServer = async () => {
  try {
    // Authenticate with the database
    await db.sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync all models (creates tables if they don't exist)
    // In production, consider using migrations instead of `sync({ force: true })`
    // `force: true` will drop existing tables and recreate them. Use with caution!
    await db.sequelize.sync(); // or db.sequelize.sync({ alter: true }); for incremental changes
    console.log("All models were synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database or start server:", error);
    process.exit(1); // Exit with a failure code
  }
};

startServer();
