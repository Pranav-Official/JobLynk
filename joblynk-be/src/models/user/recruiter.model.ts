import { Model, DataTypes, Sequelize } from "sequelize";
import { User } from "./user.model"; // Import the User model to establish the association

// Interface for Recruiter attributes
export interface RecruiterAttributes {
  id?: string; // UUID will be generated
  userId: string; // Foreign key referencing User
  companyName?: string;
  companyUrl?: string | null; // Optional, can be null
}

// Define the Recruiter class extending Sequelize's Model
export class Recruiter extends Model<RecruiterAttributes> {}

// Export a function that initializes the Recruiter model
export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  Recruiter.init(
    {
      id: {
        type: dataTypes.STRING(36), // Using STRING for UUIDs
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
      },
      userId: {
        type: dataTypes.STRING(36), // Must match the type of User's id
        allowNull: false,
        unique: true, // A user should only have one recruiter profile
        references: {
          model: "users", // This references the table name of the User model
          key: "id",
        },
        onUpdate: "CASCADE", // If User's ID changes, update here
        onDelete: "CASCADE", // If User is deleted, delete Recruiter profile
      },
      companyName: {
        type: new dataTypes.STRING(255), // Sufficient length for company names
        allowNull: true,
      },
      companyUrl: {
        type: new dataTypes.STRING(500), // Sufficient length for a URL
        allowNull: true, // Company URL is optional
        validate: {
          isUrl: true, // Sequelize's built-in URL validator
        },
      },
    },
    {
      tableName: "recruiters", // Table name for the Recruiter model
      sequelize, // Passing the `sequelize` instance is required
      timestamps: true, // Enables createdAt and updatedAt fields automatically
      underscored: true, // Use snake_case for column names in the database
    },
  );

  // Define the association
  // A Recruiter belongs to one User
  Recruiter.belongsTo(User, {
    foreignKey: "userId",
    as: "user", // Alias for the association, e.g., recruiter.user
  });

  return Recruiter;
};
