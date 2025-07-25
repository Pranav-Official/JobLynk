export enum JobType {
  FULL_TIME = "full-time",
  PART_TIME = "part-time",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
}

export type JobTypeType = JobType;

export enum JobStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  EXPIRED = "expired",
  FILLED = "filled",
}

export type JobStatusType = JobStatus;

export const JobTableName = "jobs";

export enum ApplicationStatus {
  APPLIED = "Applied",
  REVIEWED = "Reviewed",
  INTERVIEWING = "Interviewing",
  REJECTED = "Rejected",
  HIRED = "Hired",
  WITHDRAWN = "Withdrawn",
}

export type ApplicationStatusType = `${ApplicationStatus}`;
