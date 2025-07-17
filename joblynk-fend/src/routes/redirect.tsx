import { createFileRoute } from '@tanstack/react-router'
import { useAuthStatus } from '../hooks/useAuthStatus' // Adjust path as needed

export const Route = createFileRoute('/redirect')({
  component: RedirectPage,
})

function RedirectPage() {
  const { isLoggedIn, isLoading, error } = useAuthStatus()

  // You can decide what to render based on the status
  if (isLoading) {
    return (
      <div>
        <h1>Checking login status...</h1>
        <p>Please wait.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>Failed to determine login status: {error.message}</p>
        <p>You will be redirected shortly.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Redirecting...</h1>
      {isLoggedIn ? (
        <p>You are logged in and will be redirected shortly.</p>
      ) : (
        <p>You are not logged in. You will be redirected shortly.</p>
      )}
    </div>
  )
}
