import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExclamationCircle,
  faFileUpload,
  faSave,
  faSpinner,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { Modal } from './modal'

type EmploymentType = 'full-time' | 'part-time' | 'freelancer' | 'unemployed'

type SeekerProfileEditModalProps = {
  isOpen: boolean
  onClose: () => void
  initialData: {
    employmentStatus: string
    resumeUrl: string | null
  }
  onSave: (updatedData: {
    employmentStatus: string
    resumeFile: File | null
  }) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function SeekerProfileEditModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  isLoading,
  error,
}: SeekerProfileEditModalProps) {
  type FormData = {
    employmentStatus: EmploymentType
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      employmentStatus: initialData.employmentStatus as EmploymentType,
    },
  })

  const [file, setFile] = useState<File | null>(null)
  const [currentResumeUrl, setCurrentResumeUrl] = useState(
    initialData.resumeUrl,
  )

  useEffect(() => {
    if (isOpen) {
      reset({
        employmentStatus: initialData.employmentStatus as EmploymentType,
      })
      setFile(null)
      setCurrentResumeUrl(initialData.resumeUrl)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setCurrentResumeUrl(null)
      e.target.value = ''
    }
  }

  const handleClearFile = () => {
    setFile(null)
    setCurrentResumeUrl(null)
  }

  const employmentOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'freelancer', label: 'Freelancer' },
    { value: 'unemployed', label: 'Unemployed' },
  ]

  const onSubmit = async (data: FormData) => {
    await onSave({ employmentStatus: data.employmentStatus, resumeFile: file })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Edit Seeker Information
          </h3>
          <button
            onClick={() => {
              reset()
              setFile(null)
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
              htmlFor="employmentStatus"
              className="block text-sm font-medium text-gray-700"
            >
              Employment Status
            </label>
            <select
              id="employmentStatus"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register('employmentStatus', {
                required: 'Employment status is required',
              })}
            >
              {employmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.employmentStatus && (
              <p className="mt-1 text-sm text-red-600">
                {errors.employmentStatus.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume
            </label>
            <div
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out w-full
                ${
                  file || currentResumeUrl
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                    : 'border-gray-300 bg-white hover:border-blue-400'
                }`}
            >
              <FontAwesomeIcon
                icon={faFileUpload}
                className={`text-4xl mb-3 ${
                  file || currentResumeUrl ? 'text-blue-600' : 'text-gray-400'
                }`}
              />

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
                id="resume-upload"
              />

              <label
                htmlFor="resume-upload"
                className={`cursor-pointer text-center ${
                  isLoading ? 'pointer-events-none' : ''
                }`}
              >
                <span
                  className={`text-md font-semibold block mb-1 ${
                    file || currentResumeUrl ? 'text-blue-700' : 'text-gray-800'
                  }`}
                >
                  {file
                    ? file.name
                    : currentResumeUrl
                      ? 'Current Resume Uploaded'
                      : 'Choose Resume File'}
                </span>
                <span className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX files
                </span>
              </label>

              {(file || currentResumeUrl) && (
                <button
                  type="button"
                  onClick={handleClearFile}
                  disabled={isLoading}
                  className="mt-3 text-red-500 hover:text-red-700 text-sm underline"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
              {error}
            </p>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                reset()
                setFile(null)
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
              disabled={isLoading || (!isDirty && !file)}
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
