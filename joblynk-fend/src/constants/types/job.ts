// types/job.ts
export interface Job {
  id: string
  title: string
  company: string
  location: string
  postedDate: string
  salary: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote'
  experience: string
  category: string
  isRemote: boolean
  skills: Array<string>
  companySize: string
  description: string
  responsibilities: Array<string>
  requiredSkills: Array<string>
  benefits: Array<string>
  about: string
}

export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
}

export type JobTypeType = JobType

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  FILLED = 'filled',
}

export type JobStatusType = JobStatus

export const JobTableName = 'jobs'

export type JobItem = {
  id?: string
  recruiterId: string
  title: string
  descriptionMarkdown: string
  location: string
  jobType: JobTypeType
  salaryMin?: number | null
  salaryMax?: number | null
  salaryCurrency?: string | null
  applyUrl: string
  status: JobStatusType
  skills?: Array<string> | null
  postedAt?: Date | null
  expiresAt?: Date | null
  easyApply: boolean
  createdAt: Date
  updatedAt: Date
}

export type JobResponse = {
  jobs: Array<JobItem>
  total: number
  currentPage: number
  totalPages: number
}
