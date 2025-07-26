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
  (error: AxiosError<ApiResponse<any> | any>) => {
    if (error.response) {
      console.error('Axios response error - status:', error.response.status)
      console.error('Axios response error - data:', error.response.data)

      if (error.response.status === 401) {
        console.log('Received 401 Unauthorized. Checking for redirect URL.')
        const redirectTo = error.response.data && error.response.data.redirectTo
        if (redirectTo) {
          console.log(`Redirecting to: ${redirectTo}`)
          localStorage.clear()
          sessionStorage.clear()
          window.location.href = redirectTo
        } else {
          console.log('No specific redirectTo URL in response. Redirecting to default login page.')
          localStorage.clear()
          sessionStorage.clear()
          window.location.href = 'http://localhost:3000/'
        }
        return Promise.reject(error)
      }

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