import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faSearch,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import type { JobItem } from '@/constants/types/job'
import JobCard from '@/components/jobCard'
import JobDetailedView from '@/components/jobDetailedView'
import { JobType } from '@/constants/enums'
import { getJobs } from '@/services/jobs'

const searchUrlQuerySchema = z.object({
  searchQuery: z.string().min(0).max(100).optional(),
  location: z.string().min(0).max(100).optional(),
  jobType: z.string().min(0).max(100).optional(),
})

export const Route = createFileRoute('/jobs')({
  component: RouteComponent,
  validateSearch: searchUrlQuerySchema,
})

type SearchParams = {
  searchQuery: string
  location: string
  jobType: string
}

function RouteComponent() {
  const navigate = Route.useNavigate()
  const updateSearch = ({ searchQuery, location, jobType }: SearchParams) => {
    navigate({
      search: (prev) => ({
        ...prev,
        searchQuery,
        location,
        jobType,
      }),
    })
  }
  const { searchQuery, location, jobType } = Route.useSearch()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SearchParams>({
    defaultValues: {
      searchQuery: '',
      location: '',
      jobType: '',
    },
  })
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobs', searchQuery, location, jobType, currentPage],
    queryFn: () =>
      getJobs(currentPage, searchQuery || '', location || '', jobType || ''),
  })

  useEffect(() => {
    setValue('searchQuery', searchQuery || '')
    setValue('location', location || '')
    setValue('jobType', jobType || '')
  }, [searchQuery, location, jobType, setValue])

  const onSubmit = (searchparams: SearchParams) => {
    updateSearch(searchparams)
    setSelectedJob(null)
  }

  const resetSearch = () => {
    setCurrentPage(1)
    updateSearch({
      searchQuery: '',
      location: '',
      jobType: '',
    })
    reset()
    setSelectedJob(null)
  }

  const handleJobSelect = (job: JobItem) => {
    setSelectedJob(job)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)

    // Reset selected job when changing pages
    setSelectedJob(null)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!data) return []

    const pages = []
    const maxVisiblePages = 5
    const totalPages = data.totalPages

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

      if (startPage > 1) {
        pages.push(1)
        if (startPage > 2) pages.push('...')
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 pt-20 items-center justify-center">
        <div className="text-lg text-gray-600">Loading jobs...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-screen bg-gray-50 pt-20 items-center justify-center">
        <div className="text-lg text-red-600">Error loading jobs</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-screen bg-gray-50 pt-20 items-center justify-center">
        <div className="text-lg text-gray-600">No data available</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 pt-20">
      {/* Left Sidebar - Job List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Found {data.total} jobs
            </h2>
          </div>

          {/* Search and Filters */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('searchQuery')}
            />
            {errors.searchQuery && (
              <span className="text-red-500 text-sm">
                {errors.searchQuery.message}
              </span>
            )}

            <div className="flex gap-2 text-sm">
              <input
                type="text"
                placeholder="All Locations"
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
                {...register('location')}
              />
              {errors.location && (
                <span className="text-red-500 text-sm">
                  {errors.location.message}
                </span>
              )}

              <select
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
                {...register('jobType')}
              >
                <option value="">All Types</option>{' '}
                {/* Empty value for "All Types" */}
                {Object.values(JobType).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
              {errors.jobType && (
                <span className="text-red-500 text-sm">
                  {errors.jobType.message}
                </span>
              )}

              <button
                type="submit"
                className="px-3 py-2 border border-gray-300 rounded-md bg-blue-500 text-white"
              >
                <FontAwesomeIcon className="pr-2" icon={faSearch} />
                Search
              </button>

              {isDirty && (
                <button
                  className="px-3 py-2 border border-gray-600 rounded-md text-blue-900"
                  onClick={resetSearch}
                >
                  <FontAwesomeIcon className="pr-2" icon={faTimes} />
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Job Cards - Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4 pb-6">
            {data.jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                onClick={handleJobSelect}
              />
            ))}
          </div>
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="border-t border-gray-200 p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page {data.currentPage} of {data.totalPages} ({data.total} total
                jobs)
              </div>

              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === 'number' && handlePageChange(page)
                      }
                      disabled={page === '...'}
                      className={`px-3 py-1 rounded-md text-sm ${page === currentPage
                          ? 'bg-blue-600 text-white'
                          : page === '...'
                            ? 'text-gray-400 cursor-default'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === data.totalPages}
                  className={`p-2 rounded-md ${currentPage === data.totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Job Details */}
      <div className="flex-1 bg-white">
        <JobDetailedView job={selectedJob} />
      </div>
    </div>
  )
}
