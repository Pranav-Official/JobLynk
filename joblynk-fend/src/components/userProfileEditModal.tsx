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
  firstName: string
  lastName: string
  email: string
  phone: string | null
}

type UserProfileEditModalProps = {
  isOpen: boolean
  onClose: () => void
  initialData: {
    firstName: string
    lastName: string
    email: string
    phone?: string | null
  }
  onSave: (updatedData: {
    firstName: string
    lastName: string
    email: string
    phone: string | null
  }) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function UserProfileEditModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  isLoading,
  error,
}: UserProfileEditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      phone: initialData.phone || '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone || '',
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
    const submitData = {
      ...data,
      phone: data.phone === '' ? null : data.phone,
    }
    await onSave(submitData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Edit Personal Information
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
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register('firstName', { required: 'First name is required' })}
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
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register('lastName', { required: 'Last name is required' })}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed sm:text-sm"
              {...register('email')}
              disabled // Disable the input field
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register('phone', {
                pattern: {
                  value: /^\+?[0-9()\-\s]*$/,
                  message: 'Invalid phone number',
                },
              })}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
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
