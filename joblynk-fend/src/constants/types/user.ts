import type { RecruiterAttributes } from './recruiter'
import type { SeekerAttributes } from './seeker'

export interface OnboardingStep {
  id: string
  title: string
  route: string
  role: Array<'seeker' | 'recruiter'>
  hidePrevious: boolean
  hideNext: boolean
}

export type UserRole = 'seeker' | 'recruiter' | ''

export interface User {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
}

export interface UserProfile {
  user: User
  recruiter?: RecruiterAttributes
  seeker?: SeekerAttributes
}
