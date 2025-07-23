export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const AUTH_LOGIN_ENDPOINT = '/auth/login'
export const AUTH_LOGOUT_ENDPOINT = '/auth/logout'
export const AUTH_CHECK_ENDPOINT = '/auth/is-logged-in'

export const JOBS_LIST_ENDPOINT = '/jobs'
export const USER_DETAILS_ENDPOINT = '/user'
export const USER_ROLE_ENDPOINT = '/user/role'

export const SEEKER_ENDPOINT = '/seeker'

export const getFullApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`
