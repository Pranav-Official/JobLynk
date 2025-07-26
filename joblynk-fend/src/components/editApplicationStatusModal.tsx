import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { ApplicationStatusType } from '@/constants/types/application'
import { ApplicationStatus } from '@/constants/types/application'
import { updateApplicationStatusByRecruiter } from '@/services/application'

type EditApplicationStatusModalProps = {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  currentStatus: ApplicationStatusType
  onStatusUpdated: () => void
}

const dummyUpdateApplicationStatusApi = async (
  applicationId: string,
  newStatus: ApplicationStatusType,
): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `Simulating API call: Updating application ${applicationId} to status: ${newStatus}`,
      )
      resolve({ success: true, newStatus })
    }, 1000)
  })
}

export function EditApplicationStatusModal({
  isOpen,
  onClose,
  applicationId,
  currentStatus,
  onStatusUpdated,
}: EditApplicationStatusModalProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatusType>(currentStatus)

  useEffect(() => {
    setSelectedStatus(currentStatus)
  }, [currentStatus])

  const {
    mutate: updateStatusMutation,
    isPending: isUpdatingStatus,
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
    error: updateError,
  } = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: ApplicationStatusType
    }) => updateApplicationStatusByRecruiter(id, status),
    onSuccess: () => {
      onStatusUpdated()
      onClose()
      toast.success('Application status updated successfully!')
    },
    onError: (error) => {
      console.error('Failed to update application status:', error)
      toast.error('Failed to update application status')
    },
  })

  if (!isOpen) {
    return null
  }

  const handleSave = () => {
    updateStatusMutation({ id: applicationId, status: selectedStatus })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="space-y-6 p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Update Application Status
        </h2>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as ApplicationStatusType)
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isUpdatingStatus}
          >
            {Object.values(ApplicationStatus).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isUpdatingStatus}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
