import { Model, DataTypes, Sequelize } from "sequelize";
import { JobType, JobStatus, JobTableName } from "../../constants/enums";
import type { JobTypeType, JobStatusType } from "../../constants/enums";

// Interface for Job attributes
export interface JobAttributes {
  id?: string;
  recruiterId: string;
  title: string;
  descriptionMarkdown: string;
  location: string;
  jobType: JobTypeType;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  applyUrl: string;
  status: JobStatusType;
  postedAt?: Date | null;
  expiresAt?: Date | null;
  easyApply: boolean;
}

// Define the Job class extending Sequelize's Model
// Pass JobAttributes as the generic type to Model
export class Job extends Model<JobAttributes> {
  // Sequelize will handle these attributes automatically.
}

// Export a function that initializes the Job model
export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  Job.init(
    {
      id: {
        type: dataTypes.STRING(36), // Using STRING for UUIDs or similar string IDs
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Example: automatically generate UUIDs
      },
      recruiterId: {
        type: dataTypes.STRING(36),
        allowNull: false,
        references: {
          model: "recruiters", // This references the table name of the User model
          key: "id",
        },
        onUpdate: "CASCADE", // If User's ID changes, update here
        onDelete: "CASCADE", // If User is deleted, delete Recruiter profile
      },
      title: {
        type: new dataTypes.STRING(255),
        allowNull: false,
      },
      descriptionMarkdown: {
        type: dataTypes.TEXT, // Or dataTypes.LONGTEXT if needed
        allowNull: false,
      },
      location: {
        type: new dataTypes.STRING(255),
        allowNull: false,
      },
      jobType: {
        type: dataTypes.ENUM(...Object.values(JobType)),
        allowNull: false,
      },
      salaryMin: {
        type: dataTypes.INTEGER,
        allowNull: true,
      },
      salaryMax: {
        type: dataTypes.INTEGER,
        allowNull: true,
      },
      salaryCurrency: {
        type: new dataTypes.STRING(3),
        allowNull: true,
      },
      applyUrl: {
        type: new dataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: dataTypes.ENUM(...Object.values(JobStatus)),
        allowNull: false,
        defaultValue: JobStatus.DRAFT,
      },
      postedAt: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      expiresAt: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      easyApply: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: JobTableName,
      sequelize, // passing the `sequelize` instance is required
      timestamps: true, // Enables createdAt and updatedAt fields automatically
      underscored: true, // Use snake_case for column names in the database
    },
  );

  return Job;
};
