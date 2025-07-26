import type { SeekerUser } from './seeker'

export enum ApplicationStatus {
  APPLIED = 'Applied',
  REVIEWED = 'Reviewed',
  INTERVIEWING = 'Interviewing',
  REJECTED = 'Rejected',
  HIRED = 'Hired',
  WITHDRAWN = 'Withdrawn',
}

export type ApplicationStatusType = `${ApplicationStatus}`

export interface Recruiter {
  id: string
  companyName: string
}

export interface Job {
  id: string
  title: string
  location: string
  jobType: string // Consider using an enum for jobType if you have defined values
  recruiter: Recruiter
}

export interface ApplicationItem {
  id: string
  jobId: string
  seekerId: string
  applicationDate: string // ISO 8601 date string
  status: ApplicationStatusType
  createdAt: string // ISO 8601 date string
  updatedAt: string // ISO 8601 date string
  job: Job
}

export interface RecruiterApplicationItem {
  id: string
  jobId: string
  seekerId: string
  applicationDate: string // ISO 8601 date string
  status: ApplicationStatusType
  createdAt: string // ISO 8601 date string
  updatedAt: string // ISO 8601 date string
  job: Job
  seeker: SeekerUser
}

export type paginatedApplications<T> = {
  applications: Array<T>
  total: number
  currentPage: number
  totalPages: number
}
