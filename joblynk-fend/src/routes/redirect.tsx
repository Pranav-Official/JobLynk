import { createFileRoute, useRouter } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { AxiosError } from 'axios'
import { useAuthStatus } from '@/hooks/useAuthStatus'
import { getUserProfile } from '@/services/user'
import useUserStore from '@/stores/userStore'

export const Route = createFileRoute('/redirect')({
  component: RedirectPage,
})

function RedirectPage() {
  const router = useRouter()
  const { isLoggedIn, isLoading, error } = useAuthStatus()
  const { setUserData } = useUserStore()
  const {
    data,
    isLoading: isDataLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ['userDetails'],
    queryFn: () => getUserProfile(),
  })

  useEffect(() => {
    if (isError) {
      const { response } = fetchError as AxiosError
      if (response?.status === 404) {
        router.navigate({
          to: '/onboarding',
        })
      } else {
        router.navigate({
          to: '/',
        })
      }
    }
    if (data?.data.user) {
      const { firstName, lastName, email, role } = data.data.user
      console.log(firstName, lastName, email, role)
      const recruiterId = data.data.recruiter?.id
      const seekerId = data.data.seeker?.id
      setUserData(
        firstName,
        lastName,
        email,
        role,
        recruiterId || '',
        seekerId || '',
      )
      router.navigate({
        to: '/dashboard',
      })
    }
  }, [isError, data])

  return (
    <div className="flex h-screen bg-gray-50 items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        {isLoading ? (
          <>
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-blue-500 text-4xl mb-4"
            />
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Checking login status...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your authentication.
            </p>
          </>
        ) : error ? (
          <>
            <h1 className="text-xl font-semibold text-red-600 mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-600 mb-4">
              Failed to determine login status: {error.message}
            </p>
            <p className="text-gray-600">You will be redirected shortly.</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Redirecting...
            </h1>
            {isLoggedIn ? (
              <p className="text-gray-600">
                You are logged in and will be redirected to the appropriate
                page.
              </p>
            ) : (
              <p className="text-gray-600">
                You are not logged in. You will be redirected to the login page
                or homepage.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
