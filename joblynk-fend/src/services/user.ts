import type { JobResponse } from '@/constants/types/job'
import {
  USER_DETAILS_ENDPOINT,
  USER_ROLE_ENDPOINT,
} from '@/constants/endpoints'
import api from '@/utils/api'

export const getUserProfile = async (): Promise<JobResponse> => {
  const apiResponse = await api.get(`${USER_DETAILS_ENDPOINT}`)
  return apiResponse.data
}

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
): Promise<any> => {
  const apiResponse = await api.post(`${USER_DETAILS_ENDPOINT}`, {
    firstName,
    lastName,
    email,
    phone,
  })
  return apiResponse.data
}

export const updateUserRole = async (role: string): Promise<any> => {
  const apiResponse = await api.post(`${USER_ROLE_ENDPOINT}`, {
    role,
  })
  return apiResponse.data
}
