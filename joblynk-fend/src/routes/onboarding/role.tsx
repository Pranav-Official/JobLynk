import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import {
  faBriefcase,
  faChevronLeft,
  faChevronRight,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { OnboardingNavigationContext } from './route'
import type { UserRole } from '@/constants/types/user'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { updateUserRole } from '@/services/user' // Assuming updateUserRole is in '@/services/user'

export const Route = createFileRoute('/onboarding/role')({
  component: RouteComponent,
})

function RouteComponent() {
  const navContext = useContext(OnboardingNavigationContext)
  const { currentRole, setRole } = useOnboardingStore()
  const [userType, setUserType] = useState<UserRole>(currentRole)

  const {
    mutate: updateUserRoleMutation,
    isPending: isUpdatingRole,
    isError: updateRoleError,
    isSuccess: updateRoleSuccess,
    error: updateRoleErrorData,
  } = useMutation({
    mutationFn: (role: UserRole) => updateUserRole(role),
    onSuccess: (data) => {
      console.log('User role updated successfully:', data)
      setRole(userType)
      navContext?.handleNextStep()
    },
    onError: (error) => {
      console.error('Failed to update user role:', error)
    },
  })

  const onValidSubmit = () => {
    if (!userType) {
      alert('Please select whether you are a Job Seeker or a Recruiter.')
      return
    }
    console.log('Selected User Type:', userType)
    updateUserRoleMutation(userType)
  }

  const isNextButtonDisabled =
    navContext?.currentStep.hideNext || !userType || isUpdatingRole

  return (
    <>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Tell us about yourself!
          </h3>
          <p className="text-gray-600 text-lg">
            Are you looking for a job or looking to hire?
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button
            type="button"
            onClick={() => setUserType('seeker')}
            disabled={isUpdatingRole}
            className={`flex flex-col items-center justify-center p-8 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
              ${
                userType === 'seeker'
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 shadow-lg'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
              }
              w-full md:w-1/2 min-h-[180px]`}
          >
            <FontAwesomeIcon
              icon={faBriefcase}
              className={`text-5xl mb-4 ${
                userType === 'seeker' ? 'text-blue-600' : 'text-gray-500'
              }`}
            />
            <span
              className={`text-xl font-semibold ${
                userType === 'seeker' ? 'text-blue-700' : 'text-gray-800'
              }`}
            >
              Job Seeker
            </span>
            <span className="text-sm text-gray-500 mt-1">
              I'm looking for new job opportunities.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setUserType('recruiter')}
            disabled={isUpdatingRole}
            className={`flex flex-col items-center justify-center p-8 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
              ${
                userType === 'recruiter'
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 shadow-lg'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
              }
              w-full md:w-1/2 min-h-[180px]`}
          >
            <FontAwesomeIcon
              icon={faUserTie}
              className={`text-5xl mb-4 ${
                userType === 'recruiter' ? 'text-blue-600' : 'text-gray-500'
              }`}
            />
            <span
              className={`text-xl font-semibold ${
                userType === 'recruiter' ? 'text-blue-700' : 'text-gray-800'
              }`}
            >
              Recruiter
            </span>
            <span className="text-sm text-gray-500 mt-1">
              I'm looking to find and hire talent.
            </span>
          </button>
        </div>
        {!userType && (
          <p className="mt-8 text-center text-blue-700 text-sm">
            Please select an option to continue.
          </p>
        )}
        {isUpdatingRole && (
          <p className="mt-4 text-blue-600 text-center">Saving role...</p>
        )}
        {updateRoleError && (
          <p className="mt-4 text-red-600 text-center">
            Error saving role:{' '}
            {updateRoleErrorData.message || 'Please try again.'}
          </p>
        )}
        {updateRoleSuccess && (
          <p className="mt-4 text-green-600 text-center">
            Role saved successfully!
          </p>
        )}
      </div>

      <div className="p-6 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
        <button
          disabled={navContext?.currentStep.hidePrevious || isUpdatingRole}
          onClick={navContext?.handlePrevStep}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            navContext?.currentStep.hidePrevious || isUpdatingRole
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
          {isUpdatingRole ? 'Saving...' : 'Next'}
          <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
        </button>
      </div>
    </>
  )
}
