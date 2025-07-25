import { Model, DataTypes, Sequelize } from "sequelize";
import { JobType, JobStatus, JobTableName } from "../../constants/enums";
import type { JobTypeType, JobStatusType } from "../../constants/enums";
import { Recruiter } from "../user/recruiter.model";

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
  skills?: string[] | null;
}

export class Job extends Model<JobAttributes> { }

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  Job.init(
    {
      id: {
        type: dataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      recruiterId: {
        type: dataTypes.STRING(36),
        allowNull: false,
        references: {
          model: "recruiters",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: new dataTypes.STRING(255),
        allowNull: false,
      },
      descriptionMarkdown: {
        type: dataTypes.TEXT,
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
      skills: {
        type: dataTypes.ARRAY(dataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      tableName: JobTableName,
      sequelize,
      timestamps: true,
      underscored: true,
    },
  );

  return Job;
};