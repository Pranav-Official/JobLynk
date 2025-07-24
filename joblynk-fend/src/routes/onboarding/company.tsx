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
import { updateRecruiterCompany } from '@/services/recruiter'

export const Route = createFileRoute('/onboarding/company')({
  component: RouteComponent,
})

interface CompanyFormData {
  companyName: string
  companyWebsite: string
}

function RouteComponent() {
  const {
    mutate: saveCompanyMutation,
    isPending: isSavingCompany,
    isError: saveCompanyError,
    isSuccess: saveCompanySuccess,
    error: saveCompanyErrorData,
  } = useMutation({
    mutationFn: (data: CompanyFormData) =>
      updateRecruiterCompany(data.companyName, data.companyWebsite),
    onSuccess: (data) => {
      console.log('Recruiter Company saved successfully:', data)
      navContext?.handleNextStep()
    },
    onError: (error) => {
      console.error('Failed to save company details:', error)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>()
  const navContext = useContext(OnboardingNavigationContext)

  const onValidSubmit = (data: CompanyFormData) => {
    console.log('Company data:', data)
    saveCompanyMutation(data)
  }

  return (
    <>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Company Information
          </h3>
          <p className="text-gray-600">Tell us about your company.</p>
        </div>

        <form id="company-info-form" className="space-y-6">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Name
            </label>
            <input
              {...register('companyName', {
                required: 'Company name is required',
                minLength: {
                  value: 2,
                  message: 'Company name must be at least 2 characters',
                },
              })}
              type="text"
              id="companyName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your company name"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="companyWebsite"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Website URL
            </label>
            <input
              {...register('companyWebsite', {
                required: 'Company website is required',
                pattern: {
                  value:
                    /^(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
                  message: 'Please enter a valid website URL',
                },
              })}
              type="url"
              id="companyWebsite"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.example.com"
            />
            {errors.companyWebsite && (
              <p className="mt-1 text-sm text-red-600">
                {errors.companyWebsite.message}
              </p>
            )}
          </div>
        </form>

        {isSavingCompany && (
          <p className="mt-4 text-blue-600">Saving company information...</p>
        )}
        {saveCompanyError && (
          <p className="mt-4 text-red-600">
            Error saving company information: {saveCompanyErrorData.message}
          </p>
        )}
        {saveCompanySuccess && (
          <p className="mt-4 text-green-600">
            Company information saved successfully!
          </p>
        )}
      </div>

      <div className="p-6 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
        <button
          disabled={navContext?.currentStep.hidePrevious || isSavingCompany}
          onClick={navContext?.handlePrevStep}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            navContext?.currentStep.hidePrevious || isSavingCompany
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
          Previous
        </button>

        <button
          disabled={navContext?.currentStep.hideNext || isSavingCompany}
          onClick={handleSubmit(onValidSubmit)}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            navContext?.currentStep.hideNext || isSavingCompany
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isSavingCompany ? 'Saving...' : 'Next'}
          <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
        </button>
      </div>
    </>
  )
}
