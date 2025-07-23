import { useEffect, useState } from 'react'
import useStore from '@/stores/authStore'
import { AUTH_CHECK_ENDPOINT, getFullApiUrl } from '@/constants/endpoints'
import useUserStore from '@/stores/userStore'

export interface AuthStatus {
  isLoggedIn: boolean
  isLoading: boolean
  error: Error | null
}

/**
 * A custom hook to check the user's authentication status
 * by hitting the /api/auth/is-logged-in endpoint and storing
 * the result in localStorage.
 *
 * @returns {AuthStatus} An object containing:
 * - `isLoggedIn`: A boolean indicating if the user is logged in.
 * - `isLoading`: A boolean indicating if the authentication status is being fetched.
 * - `error`: An Error object if something went wrong, otherwise null.
 */
export function useAuthStatus(): AuthStatus {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn)
  const isLoggedIn = useStore((state) => state.isLoggedIn)
  const { setUserData } = useUserStore()

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true)
      setError(null)
      if (!isLoggedIn) {
        try {
          const response = await fetch(getFullApiUrl(AUTH_CHECK_ENDPOINT), {
            credentials: 'include',
          })
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          const loggedInStatus = data.isLoggedIn
          console.log('login status data:', data)
          const { firstName, lastName, email, role } = data.data.userDetails
          setUserData(firstName, lastName, email, role)

          setIsLoggedIn(loggedInStatus)
        } catch (err) {
          console.error('Failed to check login status:', err)
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsLoggedIn(false) // Assume not logged in on error
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, []) // Empty dependency array means this effect runs once on mount

  return { isLoggedIn, isLoading, error }
}
