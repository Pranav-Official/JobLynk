import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExclamationCircle,
  faSave,
  faSpinner,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { Modal } from './modal'

type FormData = {
  companyName: string
  companyWebsite: string
}

type RecruiterProfileEditModalProps = {
  isOpen: boolean
  onClose: () => void
  initialData: {
    companyName: string | null
    companyWebsite: string | null
  }
  onSave: (updatedData: {
    companyName: string
    companyWebsite: string
  }) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function RecruiterProfileEditModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  isLoading,
  error,
}: RecruiterProfileEditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      companyName: initialData.companyName || '',
      companyWebsite: initialData.companyWebsite || '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        companyName: initialData.companyName || '',
        companyWebsite: initialData.companyWebsite || '',
      })
    }
  }, [isOpen, initialData, reset])

  useEffect(() => {
    if (error) {
      setError('root.serverError', {
        type: 'server',
        message: error,
      })
    }
  }, [error, setError])

  const onSubmit = async (data: FormData) => {
    await onSave(data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Edit Company Information
          </h3>
          <button
            onClick={() => {
              reset()
              onClose()
            }}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register('companyName', {
                required: 'Company name is required',
                minLength: {
                  value: 2,
                  message: 'Company name must be at least 2 characters',
                },
              })}
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
              className="block text-sm font-medium text-gray-700"
            >
              Company Website URL
            </label>
            <input
              type="text"
              id="companyWebsite"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register('companyWebsite', {
                required: 'Company website is required',
                pattern: {
                  value:
                    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+(?:\/[^/]*)*\/?$/,
                  message:
                    'Please enter a valid website URL (e.g., example.com, www.example.com, or https://example.com)',
                },
              })}
            />
            {errors.companyWebsite && (
              <p className="mt-1 text-sm text-red-600">
                {errors.companyWebsite.message}
              </p>
            )}
          </div>

          {errors.root?.serverError && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
              {errors.root.serverError.message}
            </p>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                reset()
                onClose()
              }}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading || !isDirty}
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              ) : (
                <FontAwesomeIcon icon={faSave} className="mr-2" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
