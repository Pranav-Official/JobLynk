import type { Axios, AxiosError } from 'axios'

export type ApiResponse<T> = {
  data: T
  message?: string
  status?: string
}
