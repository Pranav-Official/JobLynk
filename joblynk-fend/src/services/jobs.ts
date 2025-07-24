import type {
  JobItem,
  JobResponse,
  JobStatusType,
  JobTypeType,
} from '@/constants/types/job'
import type { ApiResponse } from '@/constants/types/api'
import { JOBS_LIST_ENDPOINT } from '@/constants/endpoints'
import api from '@/utils/api'

export const getJobs = async (
  page: number = 1,
  searchQuery: string = '',
  location: string = '',
  jobType: string = '',
): Promise<JobResponse> => {
  const apiResponse = await api.get(
    `${JOBS_LIST_ENDPOINT}?search=${searchQuery}&location=${location}&jobType=${jobType}&page=${page}`,
  )
  return apiResponse.data.data
}

export const createJob = async (
  jobData: JobItem, // Now accepts a single JobItem object
): Promise<ApiResponse<JobItem>> => {
  const apiResponse = await api.post(`${JOBS_LIST_ENDPOINT}`, jobData) // Pass the entire jobData object
  return apiResponse.data
}
