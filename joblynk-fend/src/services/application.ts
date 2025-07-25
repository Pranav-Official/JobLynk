import type { ApiResponse } from '@/constants/types/api'
import type {
  ApplicationItem,
  RecruiterApplicationItem,
  paginatedApplications,
} from '@/constants/types/application'
import {
  APPLICATION_ENDPOINT,
  APPLICATION_RECRITER_ENDPOINT,
} from '@/constants/endpoints'
import api from '@/utils/api'

export const createApplication = async (jobId: string): Promise<any> => {
  const response = await api.post(`${APPLICATION_ENDPOINT}`, { jobId })
  return response.data
}

export const getSeekerApplications = async (): Promise<
  ApiResponse<paginatedApplications<ApplicationItem>>
> => {
  const response = await api.get(`${APPLICATION_ENDPOINT}`)
  return response.data
}

export const getRecruiterApplications = async (): Promise<
  ApiResponse<paginatedApplications<RecruiterApplicationItem>>
> => {
  const response = await api.get(`${APPLICATION_RECRITER_ENDPOINT}`)
  return response.data
}

export const updateApplicationStatusByRecruiter = async (
  applicationId: string,
  status: string,
): Promise<any> => {
  const response = await api.put(
    `${APPLICATION_RECRITER_ENDPOINT}/${applicationId}`,
    {
      status,
    },
  )
  return response.data
}
