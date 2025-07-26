// src/models/associations.ts
import { Recruiter } from "./user/recruiter.model";
import { Seeker } from "./user/seeker.model";
import { Job } from "./jobs/jobs.model"; // Corrected path to jobs model
import { User } from "./user/user.model";
import { Application } from "./jobs/application.model";

export function defineAssociations() {
  // User and Recruiter Association
  // A User can have one Recruiter profile
  User.hasOne(Recruiter, {
    foreignKey: "userId",
    as: "recruiter",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });
  // A Recruiter belongs to a User
  Recruiter.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  // User and Seeker Association
  // A User can have one Seeker profile
  User.hasOne(Seeker, {
    foreignKey: "userId",
    as: "seeker",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });
  // A Seeker belongs to a User
  Seeker.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  // Recruiter and Job Association
  // A Recruiter can have many Jobs
  Recruiter.hasMany(Job, {
    foreignKey: "recruiterId",
    as: "jobs",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });
  // A Job belongs to a Recruiter
  Job.belongsTo(Recruiter, {
    foreignKey: "recruiterId",
    as: "recruiter",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  // Job and Application Association
  // A Job can have many Applications
  Job.hasMany(Application, {
    foreignKey: "jobId",
    as: "applications",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });
  // An Application belongs to a Job
  Application.belongsTo(Job, {
    foreignKey: "jobId",
    as: "job",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  // Seeker and Application Association
  // A Seeker can have many Applications
  Seeker.hasMany(Application, {
    foreignKey: "seekerId",
    as: "applications",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });
  // An Application belongs to a Seeker
  Application.belongsTo(Seeker, {
    foreignKey: "seekerId",
    as: "seeker",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });
}
