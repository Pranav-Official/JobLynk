import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Navbar from '../components/navbar'

export const Route = createRootRoute({
  component: () => RootComponent(),
})

function RootComponent() {
  return (
    <>
      <Navbar />

      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}
