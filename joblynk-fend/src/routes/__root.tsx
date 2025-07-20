import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Navbar from '../components/navbar'
import { useAuthStatus } from '@/hooks/useAuthStatus'

export const Route = createRootRoute({
  component: () => RootComponent(),
})

function RootComponent() {
  useAuthStatus()
  return (
    <>
      <Navbar />

      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}
