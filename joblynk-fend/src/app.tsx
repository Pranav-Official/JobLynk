import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { useAuthStatus } from './hooks/useAuthStatus'
import { router } from './router'
import { useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus by default
    },
  },
})

const App = () => {
  const auth = useAuthStatus()
  useEffect(() => {
    console.log('auth', auth)
  }, [auth])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
    </QueryClientProvider>
  )
}

export default App
