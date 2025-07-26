import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config";

// Import your model initializers and their corresponding model classes
// Removed: import TaskModelInitializer, { Task } from "./task.model";
import UserModelInitializer, { User } from "./user/user.model";
import JobModelInitializer, { Job } from "./jobs/jobs.model";
import SeekerModelInitializer, { Seeker } from "./user/seeker.model";
import RecruiterModelInitializer, { Recruiter } from "./user/recruiter.model";
import ApplicationModelInitializer, {
  Application,
} from "./jobs/application.model";
import { defineAssociations } from "./assossiations";

const dbConfig = config.database;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: "postgres", // Explicitly define dialect
    logging: false, // Set to true to see SQL queries in console
  },
);

interface Db {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  User: typeof User; // Add User model type
  Seeker: typeof Seeker;
  Recruiter: typeof Recruiter;
  Application: typeof Application;
  Jobs: typeof Job; // Add Job model type
}

// Initialize an empty object to build our db object
const db: Partial<Db> = {};

// Initialize all models by passing the sequelize instance and DataTypes
db.User = UserModelInitializer(sequelize, DataTypes);
db.Seeker = SeekerModelInitializer(sequelize, DataTypes);
db.Recruiter = RecruiterModelInitializer(sequelize, DataTypes);
db.Jobs = JobModelInitializer(sequelize, DataTypes);
db.Application = ApplicationModelInitializer(sequelize, DataTypes);

defineAssociations();

// Assign sequelize instance and Sequelize class to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db as Db;
