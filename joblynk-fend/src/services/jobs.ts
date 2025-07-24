import type {
  JobItem,
  JobResponse,
  JobStatusType,
  JobTypeType,
} from '@/constants/types/job'
import type { ApiResponse } from '@/constants/types/api'
import {
  JOBS_LIST_ENDPOINT,
  JOBS_LIST_RECRUITER_ENDPOINT,
} from '@/constants/endpoints'
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

export const getJobsForRecruiter = async (
  recruiterId: string,
  page: number = 1,
  searchQuery: string = '',
  location: string = '',
  jobType: string = '',
): Promise<JobResponse> => {
  const apiResponse = await api.get(
    `${JOBS_LIST_RECRUITER_ENDPOINT}/${recruiterId}?search=${searchQuery}&location=${location}&jobType=${jobType}&page=${page}`,
  )
  return apiResponse.data.data
}

export const getDetailedJob = async (jobId: string) => {
  const response = await api.get(`${JOBS_LIST_ENDPOINT}/${jobId}`)
  console.log(response.data)
  return response.data.data
}

export const createJob = async (
  jobData: JobItem, // Now accepts a single JobItem object
): Promise<ApiResponse<JobItem>> => {
  console.log('hitting createJob POST with jobData:', jobData)
  const apiResponse = await api.post(`${JOBS_LIST_ENDPOINT}`, jobData) // Pass the entire jobData object
  console.log('response:', apiResponse.data)
  return apiResponse.data
}

export const editJob = async (
  jobId: string,
  jobData: JobItem, // Now accepts a single JobItem object
): Promise<ApiResponse<JobItem>> => {
  console.log('hitting createJob POST with jobData:', jobData)
  const apiResponse = await api.patch(`${JOBS_LIST_ENDPOINT}/${jobId}`, jobData)
  console.log('response:', apiResponse.data)
  return apiResponse.data
}
