export interface OnboardingStep {
  id: string
  title: string
  route: string
  role: Array<'seeker' | 'recruiter'>
  hidePrevious: boolean
  hideNext: boolean
}

export type UserRole = 'seeker' | 'recruiter' | ''
