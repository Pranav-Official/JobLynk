import type { ApiResponse } from '@/constants/types/api'
import type { EditUser, UserProfile } from '@/constants/types/user'
import {
  USER_DETAILS_ENDPOINT,
  USER_ROLE_ENDPOINT,
} from '@/constants/endpoints'
import api from '@/utils/api'

export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
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

export const updateUserProfile = async (userData: EditUser): Promise<any> => {
  const apiResponse = await api.put(`${USER_DETAILS_ENDPOINT}`, userData)
  return apiResponse.data
}
