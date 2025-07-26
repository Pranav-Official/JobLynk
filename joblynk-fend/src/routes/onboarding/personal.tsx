import { createFileRoute } from '@tanstack/react-router'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { OnboardingNavigationContext } from './route'
import useUserStore from '@/stores/userStore'
import { createUser } from '@/services/user'

export const Route = createFileRoute('/onboarding/personal')({
  component: RouteComponent,
})

interface PersonalFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

function RouteComponent() {
  const { firstName, lastName, email, setUserData } = useUserStore()
  const navContext = useContext(OnboardingNavigationContext)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalFormData>({
    defaultValues: {
      firstName,
      lastName,
      email,
      phone: '',
    },
  })

  const {
    mutate: createUserMutation,
    isPending: isCreatingUser, // Changed from isLoading to isPending
    isError: createUserError,
    isSuccess: createUserSuccess,
    error: createUserErrorData,
  } = useMutation({
    mutationFn: (data: PersonalFormData) =>
      createUser(data.firstName, data.lastName, data.email, data.phone),
    onSuccess: (data) => {
      console.log('User created successfully:', data)
      setUserData(
        data.firstName,
        data.lastName,
        data.email,
        "", // role
        "", // recruiterId
        "", // seekerId
      )
      navContext?.handleNextStep()
    },
    onError: (error) => {
      console.error('Failed to create user:', error)
    },
  })

  const onValidSubmit = (data: PersonalFormData) => {
    console.log('Form data to submit:', data)
    createUserMutation(data)
  }

  const isNextButtonDisabled =
    navContext?.currentStep.hideNext || isSubmitting || isCreatingUser

  return (
    <>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Personal Information
          </h3>
          <p className="text-gray-600">
            Please provide your personal details to complete your profile.
          </p>
        </div>

        <form id="personal-info-form" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters',
                  },
                })}
                type="text"
                id="firstName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your first name"
                disabled={isCreatingUser}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters',
                  },
                })}
                type="text"
                id="lastName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your last name"
                disabled={isCreatingUser}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]?[1-9][\d]{0,15}$/,
                  message: 'Please enter a valid phone number',
                },
              })}
              type="tel"
              id="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
              disabled={isCreatingUser}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
        </form>

        {isCreatingUser && (
          <p className="mt-4 text-blue-600">Saving personal information...</p>
        )}
        {createUserError && (
          <p className="mt-4 text-red-600">
            Error saving information:{' '}
            {createUserErrorData.message || 'Please try again.'}
          </p>
        )}
        {createUserSuccess && (
          <p className="mt-4 text-green-600">
            Personal information saved successfully!
          </p>
        )}
      </div>

      <div className="p-6 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
        <button
          disabled={navContext?.currentStep.hidePrevious || isCreatingUser}
          onClick={navContext?.handlePrevStep}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${navContext?.currentStep.hidePrevious || isCreatingUser
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
          Previous
        </button>

        <button
          onClick={handleSubmit(onValidSubmit)}
          disabled={isNextButtonDisabled}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${isNextButtonDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          {isCreatingUser ? 'Saving...' : 'Next'}
          <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
        </button>
      </div>
    </>
  )
}
