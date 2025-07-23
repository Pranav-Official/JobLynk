import { useMemo } from 'react'
import type { OnboardingStep, UserRole } from '@/constants/types/user'
import onboardingSteps, {
  recruiterSteps,
  seekerSteps,
} from '@/constants/onboardingSteps'

interface UseOnboardingStepsReturn {
  title: string
  currentRoute: string
  nextRoute: string | null
  previousRoute: string | null
  isNextEnabled: boolean
  isPreviousEnabled: boolean
  progress: number
  currentStep: OnboardingStep
  nextStep: OnboardingStep | null
  previousStep: OnboardingStep | null
  totalSteps: number
  currentStepIndex: number // 1-based index
}

const useOnboardingSteps = (
  stepId: string,
  userRole?: UserRole,
): UseOnboardingStepsReturn => {
  const {
    currentStep,
    currentStepIndex,
    filteredSteps,
    progress,
    nextStep,
    previousStep,
  } = useMemo(() => {
    let filtered = onboardingSteps
    if (userRole) {
      filtered = onboardingSteps.filter((step) => step.role.includes(userRole))
      if (userRole === 'seeker') {
        stepId =
          filtered.find(
            (f) =>
              f.id ===
              seekerSteps[seekerSteps.findIndex((step) => step === stepId) + 1],
          )?.id || ''
        console.log('next seeker step', stepId)
      } else {
        stepId =
          filtered.find(
            (f) =>
              f.id ===
              recruiterSteps[
                recruiterSteps.findIndex((step) => step === stepId) + 1
              ],
          )?.id || ''
        console.log('next recruiter step', stepId)
      }
    }
    const currentIndex = filtered.findIndex((step) => step.id === stepId)
    const current = filtered[currentIndex] || null // Handle case where stepId is not found
    const next = filtered[currentIndex + 1] || null
    const previous = filtered[currentIndex - 1] || null

    const calculatedProgress =
      filtered.length > 0 ? ((currentIndex + 1) / filtered.length) * 100 : 0

    return {
      filteredSteps: filtered,
      currentStep: current,
      currentStepIndex: currentIndex,
      nextStep: next,
      previousStep: previous,
      progress: calculatedProgress,
    }
  }, [stepId, userRole])

  const title = currentStep.title || ''
  const currentRoute = currentStep.route || '/'
  const nextRoute = nextStep?.route || null
  const previousRoute = previousStep?.route || null

  const isNextEnabled = !currentStep.hideNext
  const isPreviousEnabled = !currentStep.hidePrevious

  return {
    title,
    currentRoute,
    nextRoute,
    previousRoute,
    isNextEnabled,
    isPreviousEnabled,
    progress,
    currentStep,
    nextStep,
    previousStep,
    totalSteps: filteredSteps.length,
    currentStepIndex: currentStepIndex !== -1 ? currentStepIndex + 1 : 0, // 1-based index, 0 if not found
  }
}

export default useOnboardingSteps
