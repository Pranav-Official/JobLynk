// components/JobDetailedView.tsx
import React, { useState } from 'react' // Import useState
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookmark,
  faBriefcase,
  faBuilding,
  faClock,
  faExternalLinkAlt,
  faMapMarkerAlt,
  faShare,
} from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ConfirmationPopup from './confirmationPopup' // Import the new component
import type { JobItem } from '@/constants/types/job'
import type { ApiResponse } from '@/constants/types/api'
import type { AxiosError } from 'axios'
import { JobType } from '@/constants/types/job'
import { getDetailedJob } from '@/services/jobs'
import { createApplication } from '@/services/application'

interface JobDetailedViewProps {
  job: JobItem | null
}

const JobDetailedView: React.FC<JobDetailedViewProps> = ({ job }) => {
  const [showApplyConfirmation, setShowApplyConfirmation] = useState(false) // State for popup
  const {
    mutate: applyJobMutation,
    isPending: isApplyingJob,
    isError: applyJobError,
    isSuccess: applyJobSuccess,
    error: applyJobErrorData,
  } = useMutation({
    mutationFn: (jobId: string) => createApplication(jobId),
    onSuccess: (data) => {
      console.log('Application created successfully:', data)
      toast.success('Application created successfully!')
    },
    onError: (error: AxiosError<ApiResponse<any>>) => {
      console.error('Failed to save company details:', error)
      toast.error(error.response?.data.message ?? 'An error occurred')
    },
  })

  const {
    data: detailedJob,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['job', job?.id],
    queryFn: () => getDetailedJob(job?.id || ''),
    enabled: !!job?.id, // Only run query when job ID exists
  })

  if (!job) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faBriefcase}
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            size="4x"
          />
          <p className="text-lg">Select a job to view details</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (isError || !detailedJob) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <div className="text-center">
          <p className="text-lg">Error loading job details</p>
          <p className="text-sm text-gray-500 mt-2">
            Please try selecting the job again
          </p>
        </div>
      </div>
    )
  }

  const getTypeColor = (type: JobType) => {
    switch (type) {
      case JobType.FULL_TIME:
        return 'bg-blue-100 text-blue-800'
      case JobType.PART_TIME:
        return 'bg-green-100 text-green-800'
      case JobType.CONTRACT:
        return 'bg-orange-100 text-orange-800'
      case JobType.INTERNSHIP:
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatJobType = (type: JobType) => {
    switch (type) {
      case JobType.FULL_TIME:
        return 'Full-time'
      case JobType.PART_TIME:
        return 'Part-time'
      case JobType.CONTRACT:
        return 'Contract'
      case JobType.INTERNSHIP:
        return 'Internship'
      default:
        return type
    }
  }

  const formatSalary = () => {
    if (!detailedJob.salaryMin && !detailedJob.salaryMax)
      return 'Salary not specified'

    const currency = detailedJob.salaryCurrency || '$'

    if (detailedJob.salaryMin && detailedJob.salaryMax) {
      return `${currency}${detailedJob.salaryMin.toLocaleString()} - ${currency}${detailedJob.salaryMax.toLocaleString()}`
    } else if (detailedJob.salaryMin) {
      return `${currency}${detailedJob.salaryMin.toLocaleString()}+`
    } else if (detailedJob.salaryMax) {
      return `Up to ${currency}${detailedJob.salaryMax.toLocaleString()}`
    }

    return 'Salary not specified'
  }

  const formatPostedDate = () => {
    if (!detailedJob.postedAt) return 'Recently posted'

    const postedDate = new Date(detailedJob.postedAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - postedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'filled':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  const handleApplyClick = () => {
    if (!detailedJob.applyUrl || detailedJob.status !== 'active') {
      return // Prevent action if not applicable
    }

    if (detailedJob.easyApply) {
      setShowApplyConfirmation(true) // Show confirmation for Easy Apply
    } else {
      window.open(detailedJob.applyUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleConfirmEasyApply = () => {
    applyJobMutation(detailedJob.id)
    setShowApplyConfirmation(false) // Close popup
  }

  const handleCancelEasyApply = () => {
    setShowApplyConfirmation(false) // Close popup
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {detailedJob.title}
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faBuilding} className="text-gray-500" />
              <span className="text-lg font-medium text-gray-700">
                {detailedJob.recruiter.companyName || 'Company Name'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{detailedJob.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} />
                <span>{formatPostedDate()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faBookmark} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faShare} />
            </button>
          </div>
        </div>

        {/* Job Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
              detailedJob.jobType,
            )}`}
          >
            {formatJobType(detailedJob.jobType)}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              detailedJob.status,
            )}`}
          >
            {formatStatus(detailedJob.status)}
          </span>
          {detailedJob.easyApply && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Easy Apply
            </span>
          )}
          {detailedJob.expiresAt && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Expires: {new Date(detailedJob.expiresAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Salary */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {formatSalary()}
          </h2>
          <p className="text-gray-600">Estimated annual salary</p>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApplyClick}
          disabled={detailedJob.status !== 'active'} // Ensure status is 'active'
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors mb-8 flex items-center justify-center gap-2 ${
            detailedJob.status === 'active'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {detailedJob.easyApply ? 'Easy Apply' : 'Apply Now'}
          {detailedJob.applyUrl && !detailedJob.easyApply && (
            <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4" />
          )}
        </button>

        {/* Job Description */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Job Description
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {detailedJob.descriptionMarkdown}
          </p>
        </section>

        {/* Job Details */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Job Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Job ID:</span>
              <span className="text-gray-600 ml-2">
                {detailedJob.id || 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Status:</span>
              <span className="text-gray-600 ml-2">
                {formatStatus(detailedJob.status)}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Posted:</span>
              <span className="text-gray-600 ml-2">{formatPostedDate()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Last Updated:</span>
              <span className="text-gray-600 ml-2">
                {new Date(detailedJob.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>

        {/* Application Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            How to Apply
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">
              {detailedJob.easyApply
                ? 'You can apply directly through our platform with just a few clicks.'
                : 'Click the Apply Now button to be redirected to the application page.'}
            </p>
            {detailedJob.applyUrl && (
              <p className="text-sm text-gray-500">
                Application URL: {detailedJob.applyUrl}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Confirmation Popup */}
      {showApplyConfirmation && detailedJob.easyApply && (
        <ConfirmationPopup
          title="Confirm Easy Apply"
          message={`Are you sure you want to apply for "${detailedJob.title}" with your saved profile?`}
          onCancel={handleCancelEasyApply}
          onConfirm={handleConfirmEasyApply}
          confirmButtonText="Yes, Apply"
        />
      )}
    </div>
  )
}

export default JobDetailedView
