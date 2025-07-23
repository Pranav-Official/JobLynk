import { create } from 'zustand'
import type { OnboardingStep, UserRole } from '@/constants/types/user'
import onboardingSteps from '@/constants/onboardingSteps'

const seekerSteps = onboardingSteps.filter((step) =>
  step.role.includes('seeker'),
)
const recruiterSteps = onboardingSteps.filter((step) =>
  step.role.includes('recruiter'),
)

interface OnboardingStore {
  currentRole: UserRole
  currentStepIndex: number
  totalSteps: number
  currentStep: OnboardingStep
  nextStep: OnboardingStep | null
  previousStep: OnboardingStep | null
  setRole: (role: UserRole) => void
  setCurrentStepIndex: (index: number) => void
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentRole: '',
  currentStepIndex: 0,
  totalSteps: onboardingSteps.length,
  currentStep: onboardingSteps[0],
  nextStep: onboardingSteps[1] || null,
  previousStep: null,

  setRole: (role: UserRole) =>
    set((state) => {
      const roleSteps = role === 'seeker' ? seekerSteps : recruiterSteps
      const newTotalSteps = roleSteps.length
      const newStepIndex = roleSteps[state.currentStepIndex]
        ? state.currentStepIndex
        : 0
      const newCurrentStep = roleSteps[newStepIndex]
      const newNextStep = roleSteps[newStepIndex + 1] || null
      const newPreviousStep = roleSteps[newStepIndex - 1] || null

      return {
        currentRole: role,
        totalSteps: newTotalSteps,
        currentStep: newCurrentStep,
        currentStepIndex: newStepIndex,
        nextStep: newNextStep,
        previousStep: newPreviousStep,
      }
    }),

  setCurrentStepIndex: (index: number) =>
    set((state) => {
      const roleSteps =
        state.currentRole === 'seeker' ? seekerSteps : recruiterSteps
      const clampedIndex = Math.max(0, Math.min(index, roleSteps.length - 1))
      const newCurrentStep = roleSteps[clampedIndex]
      const newNextStep = roleSteps[clampedIndex + 1] || null
      const newPreviousStep = roleSteps[clampedIndex - 1] || null

      return {
        currentStepIndex: clampedIndex,
        currentStep: newCurrentStep,
        nextStep: newNextStep,
        previousStep: newPreviousStep,
      }
    }),
}))
