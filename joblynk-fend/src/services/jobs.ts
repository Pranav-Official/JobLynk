import type { JobResponse } from '@/constants/types/job'
import { JOBS_LIST_ENDPOINT } from '@/constants/endpoints'
import api from '@/utils/api'

export const getJobs = async (
  searchQuery?: string,
  location?: string,
  jobType?: string,
  page: number = 1,
): Promise<JobResponse> => {
  const apiResponse = await api.get(
    `${JOBS_LIST_ENDPOINT}?search=${searchQuery}&location=${location}&jobType=${jobType}&page=${page}`,
  )
  return apiResponse.data.data
}
