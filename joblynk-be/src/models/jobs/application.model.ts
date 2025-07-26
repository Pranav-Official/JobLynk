import { Model, DataTypes, Sequelize } from "sequelize";
import { Job } from "../jobs/jobs.model";
import { Seeker } from "../user/seeker.model";
import {
  type ApplicationStatusType,
  ApplicationStatus,
} from "../../constants/enums";

export interface ApplicationAttributes {
  id?: string;
  jobId: string;
  seekerId: string;
  applicationDate?: Date;
  status?: ApplicationStatusType;
}

export class Application extends Model<ApplicationAttributes> {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  Application.init(
    {
      id: {
        type: dataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      jobId: {
        type: dataTypes.STRING(36),
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      seekerId: {
        type: dataTypes.STRING(36),
        allowNull: false,
        references: {
          model: "seekers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      applicationDate: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: dataTypes.ENUM(...Object.values(ApplicationStatus)),
        allowNull: false,
        defaultValue: ApplicationStatus.APPLIED,
      },
    },
    {
      tableName: "applications",
      sequelize,
      timestamps: true,
      underscored: true,
    },
  );

  return Application;
};
