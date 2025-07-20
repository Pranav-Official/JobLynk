import { createFileRoute } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useAuthStatus } from '@/hooks/useAuthStatus'

export const Route = createFileRoute('/redirect')({
  component: RedirectPage,
})

function RedirectPage() {
  const { isLoggedIn, isLoading, error } = useAuthStatus()

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
