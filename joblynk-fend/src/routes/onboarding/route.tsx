import { createContext, useEffect, useState } from 'react'
import {
  Outlet,
  createFileRoute,
  redirect,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import type { OnboardingStep, UserRole } from '@/constants/types/user'
import { useOnboardingStore } from '@/stores/onboardingStore'

export const Route = createFileRoute('/onboarding')({
  beforeLoad: ({ context }) => {
    console.log('context', context)
    if (!context.auth.isLoggedIn) {
      console.log('not logged in cannot access /onboarding')
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

type OnboardingNavigationContextType = {
  handleNextStep: () => void
  handlePrevStep: () => void
  currentStep: OnboardingStep
} | null

export const OnboardingNavigationContext =
  createContext<OnboardingNavigationContextType>(null)

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentStep, currentStepIndex, totalSteps, setCurrentStepIndex } =
    useOnboardingStore()

  // Navigate to the first step on mount if we're on the base route
  useEffect(() => {
    if (location.pathname === '/onboarding' && currentStep.route) {
      navigate({ to: `${currentStep.route}` })
    }
  }, [currentStep.route, location.pathname, navigate])

  useEffect(() => {
    navigate({ to: `${currentStep.route}` })
  }, [currentStepIndex])

  const handleNextStep = () => {
    setCurrentStepIndex(currentStepIndex + 1)
  }

  const handlePrevStep = () => {
    setCurrentStepIndex(currentStepIndex - 1)
  }

  return (
    <div className="flex h-screen bg-gray-50 pt-20 justify-center items-center">
      <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Header - Progress Bar */}
        <div className="p-6 border-b border-gray-200 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            {currentStep.title || 'Loading...'}
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: `${((currentStepIndex + 1) * 100) / totalSteps}%`,
              }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {currentStepIndex + 1} of {totalSteps}
          </div>
        </div>
        <OnboardingNavigationContext.Provider
          value={{
            handleNextStep,
            handlePrevStep,
            currentStep: currentStep,
          }}
        >
          {/* Step Content Area - This will render the child routes */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </OnboardingNavigationContext.Provider>
      </div>
    </div>
  )
}
