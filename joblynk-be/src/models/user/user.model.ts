import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for User attributes
export interface UserAttributes {
  id?: string; // Changed to string based on your request
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null; // Optional, can be null
  role?: string | null; // Optional, can be null
}

// Define the User class extending Sequelize's Model
export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string; // Changed to string
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string | null; // Can be null
  public role!: string | null; // Can be null

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Export a function that initializes the User model
export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  User.init(
    {
      id: {
        type: dataTypes.STRING(36), // Using STRING for UUIDs or similar string IDs
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Example: automatically generate UUIDs
      },
      firstName: {
        type: new dataTypes.STRING(128),
        allowNull: false,
      },
      lastName: {
        type: new dataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: new dataTypes.STRING(255),
        allowNull: false,
        unique: true, // Email should be unique
      },
      phone: {
        type: new dataTypes.STRING(20),
        allowNull: true, // Phone is optional
      },
      role: {
        type: new dataTypes.STRING(20),
        allowNull: true, // Role is optional
      },
    },
    {
      tableName: "users",
      sequelize, // passing the `sequelize` instance is required
      timestamps: true, // Enables createdAt and updatedAt fields automatically
      underscored: true, // Use snake_case for column names in the database
    },
  );

  return User;
};
