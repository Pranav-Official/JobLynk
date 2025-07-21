import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import type { UserRole } from '@/constants/types/user'
import useOnboardingSteps from '@/hooks/useOnboardingStep'

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

// Placeholder for the content of each step
const StepContentOutlet = ({ step }: { step: number }) => {
  return (
    <div className="p-8 flex items-center justify-center h-full">
      <h3 className="text-xl text-gray-700">Content for Step {step}</h3>
    </div>
  )
}

function RouteComponent() {
  const [stepId, setStepId] = useState('step1')
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('')
  const {
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
    totalSteps,
    currentStepIndex,
  } = useOnboardingSteps(stepId || 'step1', currentUserRole)
  const [cStep, setcStep] = useState(1)

  const handleNextStep = () => {
    setStepId(nextStep?.id || stepId)
  }

  const handlePrevStep = () => {
    setStepId(previousStep?.id || stepId)
  }

  const progressPercentage = ((cStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="flex h-screen bg-gray-50 pt-20 justify-center items-center">
      <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Header - Progress Bar */}
        <div className="p-6 border-b border-gray-200 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            {currentStep?.title || 'Loading...'}
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {cStep} of {totalSteps}
          </div>
        </div>

        {/* Step Content Area */}
        <div className="flex-1 overflow-y-auto">
          <StepContentOutlet step={cStep} />
        </div>

        {/* Footer - Navigation Buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
          <button
            onClick={handlePrevStep}
            disabled={currentStep?.hidePrevious}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              currentStep?.hidePrevious
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            Previous
          </button>

          <button
            onClick={handleNextStep}
            disabled={currentStep?.hideNext}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              currentStep?.hideNext
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}
