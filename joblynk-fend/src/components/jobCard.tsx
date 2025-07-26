// components/JobCard.tsx
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import type { JobItem } from '@/constants/types/job'
import { JobType } from '@/constants/types/job'

interface JobCardProps {
  job: JobItem
  isSelected?: boolean
  onClick: (job: JobItem) => void
}

const JobCard: React.FC<JobCardProps> = ({ job, isSelected, onClick }) => {
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
    if (!job.salaryMin && !job.salaryMax) return 'Salary not specified'

    const currency = job.salaryCurrency || '$'

    if (job.salaryMin && job.salaryMax) {
      return `${currency}${job.salaryMin.toLocaleString()} - ${currency}${job.salaryMax.toLocaleString()}`
    } else if (job.salaryMin) {
      return `${currency}${job.salaryMin.toLocaleString()}+`
    } else if (job.salaryMax) {
      return `Up to ${currency}${job.salaryMax.toLocaleString()}`
    }

    return 'Salary not specified'
  }

  const formatPostedDate = () => {
    if (!job.postedAt) return 'Recently posted'

    const postedDate = new Date(job.postedAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - postedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
        }`}
      onClick={() => onClick(job)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(
            job.jobType,
          )}`}
        >
          {formatJobType(job.jobType)}
        </span>
      </div>
      <p className="text-gray-600 mb-2">{job.recruiter.companyName}</p>{' '}
      {/* You might want to add company field to JobItem */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
          <span>{formatPostedDate()}</span>
        </div>
      </div>
      <div className="mb-3">
        <p className="font-semibold text-gray-900">{formatSalary()}</p>

        {job.easyApply && (
          <span className="inline-block mt-1 ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            Easy Apply
          </span>
        )}
      </div>
    </div>
  )
}

export default JobCard
