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
  title: string,
  descriptionMarkdown: string,
  location: string,
  jobType: JobTypeType,
  status: JobStatusType,
  easyApply: boolean,
  applyUrl: string,
  salaryMin?: number | null,
  salaryMax?: number | null,
  salaryCurrency?: string | null,
  postedAt?: Date | null,
  expiresAt?: Date | null,
): Promise<ApiResponse<JobItem>> => {
  const apiResponse = await api.post(`${JOBS_LIST_ENDPOINT}`, {
    title,
    descriptionMarkdown,
    location,
    jobType,
    salaryMin,
    salaryMax,
    salaryCurrency,
    applyUrl,
    status,
    postedAt,
    expiresAt,
    easyApply,
  })
  return apiResponse.data
}
