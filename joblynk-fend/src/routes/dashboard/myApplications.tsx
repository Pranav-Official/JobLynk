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
  faSort,
  faSortDown,
  faSortUp,
} from '@fortawesome/free-solid-svg-icons'
import { useQuery } from '@tanstack/react-query'
import { getSeekerApplications } from '@/services/application'
import { ApplicationStatus } from '@/constants/types/application' // Assuming you have this enum

// Import your defined types

export const Route = createFileRoute('/dashboard/myApplications')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    data: applicationResponse,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['seeker/applications'],
    queryFn: () => getSeekerApplications(),
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

  const columns = useMemo(
    () => [
      {
        accessorKey: 'job.title', // Access nested property
        header: 'Job Title',
        cell: (info: any) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: 'job.recruiter.companyName', // Access nested property for company name
        header: 'Company',
        cell: (info: any) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: 'job.location', // Access nested property for location
        header: 'Location',
        cell: (info: any) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
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
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              info.getValue() === ApplicationStatus.APPLIED
                ? 'bg-blue-100 text-blue-800'
                : info.getValue() === ApplicationStatus.REVIEWED
                  ? 'bg-yellow-100 text-yellow-800'
                  : info.getValue() === ApplicationStatus.INTERVIEWING
                    ? 'bg-purple-100 text-purple-800'
                    : info.getValue() === ApplicationStatus.REJECTED
                      ? 'bg-red-100 text-red-800'
                      : info.getValue() === ApplicationStatus.HIRED
                        ? 'bg-green-100 text-green-800'
                        : info.getValue() === ApplicationStatus.WITHDRAWN
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
            }`}
          >
            {info.getValue()}
          </span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleView(info.row.original.id)}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              title="View Application"
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
          My Job Applications
        </h2>
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
    </div>
  )
}
