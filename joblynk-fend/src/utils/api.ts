import axios from 'axios'
import type { ApiResponse } from '@/constants/types/api'
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

const api: AxiosInstance = axios.create()

api.interceptors.request.use(
  (config) => {
    config.baseURL =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
    config.withCredentials = true
    return config
  },
  (error: AxiosError) => {
    console.error('Axios request error:', error.message)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response
  },
  (error: AxiosError<ApiResponse<any>>) => {
    if (error.response) {
      console.error('Axios response error - status:', error.response.status)
      console.error('Axios response error - data:', error.response.data)
      return Promise.reject(error)
    } else if (error.request) {
      console.error('Axios no response error:', error.request)
      return Promise.reject(new Error('No response received from server.'))
    } else {
      console.error('Axios setup error:', error.message)
      return Promise.reject(new Error('Axios setup failed.'))
    }
  },
)

export default api
