import type { ApiResponse } from '@/constants/types/api'
import type { SeekerAttributes } from '@/constants/types/seeker'
import { SEEKER_ENDPOINT } from '@/constants/endpoints'
import api from '@/utils/api'

export const updateSeekerEmployment = async (
  employmentStatus: string,
): Promise<ApiResponse<SeekerAttributes>> => {
  const apiResponse = await api.post(`${SEEKER_ENDPOINT}`, {
    employmentStatus,
  })
  return apiResponse.data
}
