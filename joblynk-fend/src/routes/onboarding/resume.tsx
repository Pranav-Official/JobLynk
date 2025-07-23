import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import {
  faChevronLeft,
  faChevronRight,
  faFileUpload,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { OnboardingNavigationContext } from './route'
import { updateSeekerResume } from '@/services/seeker'
import { portPresignedURL, uploadFileToS3 } from '@/services/file'

export const Route = createFileRoute('/onboarding/resume')({
  component: RouteComponent,
})

function RouteComponent() {
  const navContext = useContext(OnboardingNavigationContext)
  const [file, setFile] = useState<File | null>(null)

  const {
    mutate: uploadResumeMutation,
    isPending: isUploading,
    isError: uploadError,
    isSuccess: uploadSuccess,
    error: uploadErrorData,
  } = useMutation({
    mutationFn: async (file: File) => {
      const presignedRes = await portPresignedURL(file)
      const { url, fields, key } = presignedRes.data

      const formData = new FormData()
      Object.entries(fields).forEach(([k, v]) =>
        formData.append(k, v as string)
      )
      formData.append('Content-Type', file.type)
      formData.append('file', file)

      await uploadFileToS3(url, formData)
      await updateSeekerResume(key)
      return key
    },
    onSuccess: (key) => {
      console.log('File uploaded successfully:', key)
      navContext?.handleNextStep()
    },
    onError: (error) => {
      console.error('Upload failed:', error)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleClear = () => {
    setFile(null)
  }

  const onValidSubmit = () => {
    if (!file) {
      alert('Please select a resume file to upload.')
      return
    }
    uploadResumeMutation(file)
  }

  const isNextButtonDisabled =
    navContext?.currentStep.hideNext || !file || isUploading

  return (
    <>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Your Resume
          </h3>
          <p className="text-gray-600 text-lg">
            Share your resume to help us understand your background better.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out w-full max-w-md min-h-[200px]
              ${file
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                : 'border-gray-300 bg-white hover:border-blue-400'
              }`}
          >
            <FontAwesomeIcon
              icon={faFileUpload}
              className={`text-5xl mb-4 ${file ? 'text-blue-600' : 'text-gray-400'
                }`}
            />

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              disabled={isUploading}
              className="hidden"
              id="resume-upload"
            />

            <label
              htmlFor="resume-upload"
              className={`cursor-pointer text-center ${isUploading ? 'pointer-events-none' : ''
                }`}
            >
              <span
                className={`text-xl font-semibold block mb-2 ${file ? 'text-blue-700' : 'text-gray-800'
                  }`}
              >
                {file ? file.name : 'Choose Resume File'}
              </span>
              <span className="text-sm text-gray-500">
                Supports PDF, DOC, DOCX files
              </span>
            </label>

            {file && (
              <button
                onClick={handleClear}
                disabled={isUploading}
                className="mt-4 text-red-500 hover:text-red-700 text-sm underline"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-1" />
                Clear Selection
              </button>
            )}
          </div>

          {!file && (
            <p className="mt-8 text-center text-blue-700 text-sm">
              Please select a resume file to continue.
            </p>
          )}

          {isUploading && (
            <p className="mt-4 text-blue-600 text-center">
              Uploading resume...
            </p>
          )}

          {uploadError && (
            <p className="mt-4 text-red-600 text-center">
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Upload failed:{' '}
              {uploadErrorData?.message || 'Please try again.'}
            </p>
          )}

          {uploadSuccess && (
            <p className="mt-4 text-green-600 text-center">
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Resume uploaded successfully!
            </p>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
        <button
          disabled={navContext?.currentStep.hidePrevious || isUploading}
          onClick={navContext?.handlePrevStep}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${navContext?.currentStep.hidePrevious || isUploading
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
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${isNextButtonDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          {isUploading ? 'Uploading...' : 'Next'}
          <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
        </button>
      </div>
    </>
  )
}