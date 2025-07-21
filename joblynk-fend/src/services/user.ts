import type { JobResponse } from '@/constants/types/job'
import { USER_DETAILS_ENDPOINT } from '@/constants/endpoints'
import api from '@/utils/api'

export const getUserProfile = async (): Promise<JobResponse> => {
  const apiResponse = await api.get(`${USER_DETAILS_ENDPOINT}`)
  return apiResponse.data
}
