import type { User } from './user'

export interface SeekerAttributes {
  id?: string
  userId: string
  employmentStatus?: string
  resumeUrl?: string
}

export interface SeekerUser {
  userId: string
  employmentStatus?: string
  resumeUrl?: string
  user: User
}
