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
  faEye,
  faFileAlt,
  faSort,
  faSortDown,
  faSortUp,
} from '@fortawesome/free-solid-svg-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { RecruiterApplicationItem } from '@/constants/types/application'
import { ApplicationStatus } from '@/constants/types/application'
import { getRecruiterApplications } from '@/services/application'
import { Modal } from '@/components/modal'
import { EditApplicationStatusModal } from '@/components/editApplicationStatusModal'

export const Route = createFileRoute('/dashboard/applications')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingApplication, setEditingApplication] =
    useState<RecruiterApplicationItem | null>(null)

  const {
    data: applicationResponse,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['recruiter/applications'],
    queryFn: () => getRecruiterApplications(),
  })

  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const handleView = (applicationId: string) => {
    console.log(`View application with ID: ${applicationId}`)
    alert(`Viewing application: ${applicationId}`)
  }

  const handleEditStatusClick = (application: RecruiterApplicationItem) => {
    setEditingApplication(application)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingApplication(null)
  }

  const handleStatusSuccessfullyUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['recruiter/applications'] })
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'job.title',
        header: 'Job Title',
        cell: (info: any) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorFn: (row: RecruiterApplicationItem) =>
          row.seeker.user.firstName,
        id: 'firstName',
        header: 'First Name',
        cell: (info: any) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorFn: (row: RecruiterApplicationItem) => row.seeker.user.lastName,
        id: 'lastName',
        header: 'Last Name',
        cell: (info: any) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorFn: (row: RecruiterApplicationItem) => row.seeker.user.email,
        id: 'email',
        header: 'Email',
        cell: (info: any) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorFn: (row: RecruiterApplicationItem) => row.seeker.resumeUrl,
        id: 'resume',
        header: 'Resume',
        cell: (info: any) => {
          const resumeUrl = info.getValue()
          if (resumeUrl) {
            return (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faFileAlt} />
                View Resume
              </a>
            )
          }
          return 'N/A'
        },
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'applicationDate',
        header: 'Application Date',
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
          <button
            onClick={() => handleEditStatusClick(info.row.original)}
            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors duration-200 ${
              info.getValue() === ApplicationStatus.APPLIED
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                : info.getValue() === ApplicationStatus.REVIEWED
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : info.getValue() === ApplicationStatus.INTERVIEWING
                    ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    : info.getValue() === ApplicationStatus.REJECTED
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : info.getValue() === ApplicationStatus.HIRED
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : info.getValue() === ApplicationStatus.WITHDRAWN
                          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            title="Click to change status"
          >
            {info.getValue()}
          </button>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        id: 'viewAction',
        header: 'View',
        cell: (info: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleView(info.row.original.id)}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              title="View Application Details"
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    [],
  )

  const table = useReactTable({
    data: applicationResponse?.data.applications || [],
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
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading applications...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Error loading applications.
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full p-8 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          <FontAwesomeIcon icon={faBriefcase} className="mr-3 text-blue-600" />
          Job Applications
        </h2>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of{' '}
          {applicationResponse?.data.total || 0} applications
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
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
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

      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        {editingApplication && (
          <EditApplicationStatusModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            applicationId={editingApplication.id}
            currentStatus={editingApplication.status}
            onStatusUpdated={handleStatusSuccessfullyUpdated}
          />
        )}
      </Modal>
    </div>
  )
}
