import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import {
  faChevronLeft,
  faChevronRight,
  faClock,
  faClockFour,
  faLaptop,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { OnboardingNavigationContext } from './route'
import { updateSeekerEmployment } from '@/services/seeker'

export const Route = createFileRoute('/onboarding/employment')({
  component: RouteComponent,
})

type EmploymentType = 'full-time' | 'part-time' | 'freelancer' | 'unemployed'

function RouteComponent() {
  const navContext = useContext(OnboardingNavigationContext)
  const [employmentType, setEmploymentType] = useState<EmploymentType | null>(
    null,
  )

  const {
    mutate: updateEmploymentMutation,
    isPending: isUpdatingEmployment,
    isError: updateEmploymentError,
    isSuccess: updateEmploymentSuccess,
    error: updateEmploymentErrorData,
  } = useMutation({
    mutationFn: (employment: EmploymentType) =>
      updateSeekerEmployment(employment),
    onSuccess: (data) => {
      console.log('Employment status updated successfully:', data)
      navContext?.handleNextStep()
    },
    onError: (error) => {
      console.error('Failed to update employment status:', error)
    },
  })

  const onValidSubmit = () => {
    if (!employmentType) {
      alert('Please select your current employment status.')
      return
    }
    console.log('Selected Employment Type:', employmentType)
    updateEmploymentMutation(employmentType)
  }

  const employmentOptions = [
    {
      value: 'full-time' as EmploymentType,
      icon: faClock,
      title: 'Full-time',
      description: 'Working 40+ hours per week',
    },
    {
      value: 'part-time' as EmploymentType,
      icon: faClockFour,
      title: 'Part-time',
      description: 'Working less than 40 hours per week',
    },
    {
      value: 'freelancer' as EmploymentType,
      icon: faLaptop,
      title: 'Freelancer',
      description: 'Working on contract or project basis',
    },
    {
      value: 'unemployed' as EmploymentType,
      icon: faUserSlash,
      title: 'Unemployed',
      description: 'Currently not working',
    },
  ]

  const isNextButtonDisabled =
    navContext?.currentStep.hideNext || !employmentType || isUpdatingEmployment

  return (
    <>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            What's your current employment status?
          </h3>
          <p className="text-gray-600 text-lg">
            This helps us understand your availability and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employmentOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setEmploymentType(option.value)}
              disabled={isUpdatingEmployment}
              className={`flex flex-col items-center justify-center p-8 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                ${
                  employmentType === option.value
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 shadow-lg'
                    : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
                }
                min-h-[180px]`}
            >
              <FontAwesomeIcon
                icon={option.icon}
                className={`text-5xl mb-4 ${
                  employmentType === option.value
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}
              />
              <span
                className={`text-xl font-semibold ${
                  employmentType === option.value
                    ? 'text-blue-700'
                    : 'text-gray-800'
                }`}
              >
                {option.title}
              </span>
              <span className="text-sm text-gray-500 mt-1 text-center">
                {option.description}
              </span>
            </button>
          ))}
        </div>

        {!employmentType && (
          <p className="mt-8 text-center text-blue-700 text-sm">
            Please select your current employment status to continue.
          </p>
        )}
        {isUpdatingEmployment && (
          <p className="mt-4 text-blue-600 text-center">
            Saving employment status...
          </p>
        )}
        {updateEmploymentError && (
          <p className="mt-4 text-red-600 text-center">
            Error saving employment status:{' '}
            {updateEmploymentErrorData.message || 'Please try again.'}
          </p>
        )}
        {updateEmploymentSuccess && (
          <p className="mt-4 text-green-600 text-center">
            Employment status saved successfully!
          </p>
        )}
      </div>

      <div className="p-6 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
        <button
          disabled={
            navContext?.currentStep.hidePrevious || isUpdatingEmployment
          }
          onClick={navContext?.handlePrevStep}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            navContext?.currentStep.hidePrevious || isUpdatingEmployment
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
          Previous
        </button>

        <button
          disabled={isNextButtonDisabled}
          onClick={onValidSubmit}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            isNextButtonDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isUpdatingEmployment ? 'Saving...' : 'Next'}
          <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
        </button>
      </div>
    </>
  )
}
