import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'
import { router } from './router'
import useStore from './stores/authStore'
import useUserStore from './stores/userStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus by default
    },
  },
})

const App = () => {
  const isLoggedIn = useStore((state) => state.isLoggedIn)
  const { role } = useUserStore()
  const auth = {
    isLoggedIn,
    role,
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}

export default App
