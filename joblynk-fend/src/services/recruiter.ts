import type { ApiResponse } from '@/constants/types/api'
import type { RecruiterAttributes } from '@/constants/types/recruiter'
import { RECRITER_ENDPOINT } from '@/constants/endpoints'
import api from '@/utils/api'

export const updateRecruiterCompany = async (
  companyName?: string,
  companyUrl?: string,
): Promise<ApiResponse<RecruiterAttributes>> => {
  const apiResponse = await api.patch(`${RECRITER_ENDPOINT}`, {
    companyName,
    companyUrl,
  })
  return apiResponse.data
}
