import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
  useRouter,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faFileAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import useUserStore from '@/stores/userStore'
import { FCPThresholds } from 'web-vitals'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    console.log('context', context)
    if (!context.auth.isLoggedIn) {
      console.log('not logged in cannot access /onboarding')
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const location = useLocation()
  const { firstName, role } = useUserStore()
  const [selectedMenuItem, setSelectedMenuItem] = useState('profile')

  const selectPage = (page: string) => {
    setSelectedMenuItem(page)
    router.navigate({
      to: '/dashboard/' + page,
    })
  }

  useEffect(() => {
    console.log('useEffect role', role, firstName)
    if (location.pathname === '/dashboard') {
      router.navigate({
        to: '/dashboard/profile',
      })
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 pt-20">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        </div>
        <nav className="flex-1 space-y-2">
          <button
            className={`w-full flex items-center p-3 rounded-md text-xl font-medium transition-colors duration-200 ${
              selectedMenuItem === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
            onClick={() => selectPage('profile')}
          >
            <FontAwesomeIcon icon={faUser} className="mr-3 w-5 h-5" />
            Profile
          </button>
          {role === 'recruiter' && (
            <button
              className={`w-full flex items-center p-3 rounded-md text-xl font-medium transition-colors duration-200 ${
                selectedMenuItem === 'jobs'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => selectPage('jobs')}
            >
              <FontAwesomeIcon icon={faBriefcase} className="mr-3 w-5 h-5" />
              Jobs
            </button>
          )}

          <button
            className={`w-full flex items-center p-3 rounded-md text-xl font-medium transition-colors duration-200 ${
              selectedMenuItem === 'applications'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
            onClick={() => selectPage('applications')}
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-3 w-5 h-5" />
            Applications
          </button>
        </nav>
      </div>

      {/* Right Side - Main Content */}
      <div className="flex-1 bg-white p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
