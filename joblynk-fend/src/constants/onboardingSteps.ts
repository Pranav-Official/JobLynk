import type { OnboardingStep } from './types/user'

const onboardingSteps: Array<OnboardingStep> = [
  {
    id: 'step1',
    title: 'Welcome to Joblynk!',
    route: '/onboarding/personal',
    role: ['seeker', 'recruiter'],
    hidePrevious: true,
    hideNext: false,
  },
  {
    id: 'step2',
    title: 'Choose Your Role',
    route: '/onboarding/role',
    role: ['seeker', 'recruiter'],
    hidePrevious: true,
    hideNext: false,
  },
  {
    id: 'step3',
    title: 'Employment Status',
    route: '/onboarding/employment',
    role: ['seeker'],
    hidePrevious: false,
    hideNext: false,
  },
  {
    id: 'step4',
    title: 'Upload Your Resume',
    route: '/onboarding/resume',
    role: ['seeker'],
    hidePrevious: false,
    hideNext: false,
  },
  {
    id: 'step5',
    title: 'Which company are you recruiting for?',
    route: '/onboarding/company',
    role: ['recruiter'],
    hidePrevious: false,
    hideNext: false,
  },
  {
    id: 'step6',
    title: 'Head to Your Profile',
    route: '/onboarding/exit',
    role: ['seeker', 'recruiter'],
    hidePrevious: false,
    hideNext: true,
  },
]

export default onboardingSteps
