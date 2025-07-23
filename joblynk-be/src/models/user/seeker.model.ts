import { Model, DataTypes, Sequelize } from "sequelize";
import { User } from "./user.model"; // Import the User model to establish the association

// Interface for Seeker attributes
export interface SeekerAttributes {
  id?: string; // UUID will be generated
  userId: string; // Foreign key referencing User
  employmentStatus?: string;
  resumeUrl?: string;
}

export class Seeker extends Model<SeekerAttributes> { }

// Export a function that initializes the Seeker model
export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  Seeker.init(
    {
      id: {
        type: dataTypes.STRING(36), // Using STRING for UUIDs
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
      },
      userId: {
        type: dataTypes.STRING(36), // Must match the type of User's id
        allowNull: false,
        unique: true, // A user should only have one seeker profile
        references: {
          model: "users", // This references the table name of the User model
          key: "id",
        },
        onUpdate: "CASCADE", // If User's ID changes, update here
        onDelete: "CASCADE", // If User is deleted, delete Seeker profile
      },
      employmentStatus: {
        type: new dataTypes.STRING(50),
        allowNull: true,
        // You might want to define an ENUM here for specific statuses, e.g.,
        // type: DataTypes.ENUM('employed', 'unemployed', 'student', 'freelancer'),
      },
      resumeUrl: {
        type: new dataTypes.STRING(500), // Sufficient length for a URL
        allowNull: true,
      },
    },
    {
      tableName: "seekers", // Table name for the Seeker model
      sequelize, // Passing the `sequelize` instance is required
      timestamps: true, // Enables createdAt and updatedAt fields automatically
      underscored: true, // Use snake_case for column names in the database
    },
  );

  // Define the association
  // A Seeker belongs to one User
  Seeker.belongsTo(User, {
    foreignKey: "userId",
    as: "user", // Alias for the association, e.g., seeker.user
  });

  return Seeker;
};
