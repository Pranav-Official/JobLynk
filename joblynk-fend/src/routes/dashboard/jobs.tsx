import { createFileRoute } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faEdit,
  faEye,
  faPlus,
  faSort,
  faSortDown,
  faSortUp,
} from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { JobItem } from '@/constants/types/job'
import { CreateJobForm } from '@/components/createJobForm'
import { Modal } from '@/components/modal' // Adjust import path
import { JobStatus, JobType } from '@/constants/enums'
import { getJobs } from '@/services/jobs' // Assuming you have a createJob service

export const Route = createFileRoute('/dashboard/jobs')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recuiter/jobs'],
    queryFn: () => getJobs(1),
  })

  // Mutation for creating a new job
  // const createJobMutation = useMutation({
  //   mutationFn: createJob, // This function should take the new job data as an argument
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['recuiter/jobs'] }) // Invalidate and refetch jobs
  //     setIsCreateModalOpen(false) // Close the modal on success
  //     alert('Job created successfully!')
  //   },
  //   onError: (error) => {
  //     console.error('Error creating job:', error)
  //     alert(`Failed to create job: ${error.message || 'Unknown error'}`)
  //   },
  // })

  const handleView = (jobId: string | undefined) => {
    console.log(`View job with ID: ${jobId}`)
    alert(`Viewing job: ${jobId}`)
  }

  const handleEdit = (jobId: string | undefined) => {
    console.log(`Edit job with ID: ${jobId}`)
    alert(`Editing job: ${jobId}`)
  }

  const handleCreateJobPost = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleCreateJobSubmit = (formData: any) => {
    // You might need to transform formData into the JobItem type
    // before sending it to your backend.
    // For example, if expiresAt is optional, convert "" to null.
    const newJobData: JobItem = {
      ...formData,
      salaryMin: formData.salaryMin === '' ? null : formData.salaryMin,
      salaryMax: formData.salaryMax === '' ? null : formData.salaryMax,
      salaryCurrency:
        formData.salaryCurrency === '' ? null : formData.salaryCurrency,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
      // recruiterId would typically come from your authenticated user's context
      recruiterId: 'example-recruiter-id', // Placeholder, replace with actual ID
      postedAt: new Date(), // Set current date as postedAt
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    console.log('Submitting new job:', newJobData)
    // createJobMutation.mutate(newJobData)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Job Title',
        cell: (info: any) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: (info: any) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: 'jobType',
        header: 'Job Type',
        cell: (info: any) =>
          info.getValue().charAt(0).toUpperCase() +
          info.getValue().slice(1).replace('-', ' '),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorFn: (row: JobItem) => {
          if (row.salaryMin && row.salaryMax) {
            return `${row.salaryMin} - ${row.salaryMax} ${row.salaryCurrency}`
          } else if (row.salaryMin) {
            return `From ${row.salaryMin} ${row.salaryCurrency}`
          } else if (row.salaryMax) {
            return `Up to ${row.salaryMax} ${row.salaryCurrency}`
          }
          return 'N/A'
        },
        id: 'salary', // Unique ID for the column
        header: 'Salary',
        cell: (info: any) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: 'postedAt',
        header: 'Posted Date',
        cell: (info: any) => {
          const dateValue = info.getValue()
          if (dateValue) {
            const date = new Date(dateValue)
            return date.toLocaleDateString(navigator.language, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          }
          return ''
        },
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info: any) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              info.getValue() === JobStatus.ACTIVE
                ? 'bg-green-100 text-green-800'
                : info.getValue() === JobStatus.DRAFT
                  ? 'bg-yellow-100 text-yellow-800'
                  : info.getValue() === JobStatus.EXPIRED
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800' // For FILLED status
            }`}
          >
            {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
          </span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        id: 'actions', // Unique ID for the actions column
        header: 'Actions',
        cell: (info: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleView(info.row.original.id)}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              title="View Job"
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button
              onClick={() => handleEdit(info.row.original.id)}
              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              title="Edit Job"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    [],
  )

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])

  const table = useReactTable({
    data: data?.jobs || [],
    columns,
    state: {
      pagination,
      globalFilter,
      sorting,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugTable: true, // Uncomment for debugging table state
  })

  return (
    <div className="flex flex-col h-full w-full p-8 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          <FontAwesomeIcon icon={faBriefcase} className="mr-3 text-blue-600" />
          Job Listings
        </h2>
        <button
          onClick={handleCreateJobPost}
          className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center text-lg font-medium"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Create Job Post
        </button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of {data?.total} jobs
        </div>
      </div>

      <div className="flex-1 overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: (
                          <FontAwesomeIcon icon={faSortUp} className="ml-2" />
                        ),
                        desc: (
                          <FontAwesomeIcon icon={faSortDown} className="ml-2" />
                        ),
                      }[header.column.getIsSorted() as string] ??
                        (header.column.getCanSort() ? (
                          <FontAwesomeIcon
                            icon={faSort}
                            className="ml-2 text-gray-400"
                          />
                        ) : null)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'>>'}
          </button>
        </div>

        <span className="flex items-center gap-1 text-sm text-gray-700">
          Page{' '}
          <strong>
            {data?.currentPage} of {data?.totalPages}
          </strong>
        </span>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
          className="border rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      {/* Create Job Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal}>
        <CreateJobForm
          onClose={handleCloseCreateModal}
          onSubmit={handleCreateJobSubmit}
          isLoading={false} // Pass loading state to form
        />
      </Modal>
    </div>
  )
}
