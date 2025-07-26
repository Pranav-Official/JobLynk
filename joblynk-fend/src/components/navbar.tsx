import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import {
  AUTH_LOGIN_ENDPOINT,
  AUTH_LOGOUT_ENDPOINT,
  getFullApiUrl,
} from '../constants/endpoints'
import useStore from '../stores/authStore'

export default function NavBar() {
  const navigate = useNavigate()
  const routerState = useRouterState()
  const loginUrl = getFullApiUrl(AUTH_LOGIN_ENDPOINT)
  const logoutUrl = getFullApiUrl(AUTH_LOGOUT_ENDPOINT)
  const [isLoading, setIsLoading] = useState(false)
  const isLoggedIn = useStore((state) => state.isLoggedIn)
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn)

  const handleAuthClick = () => {
    setIsLoading(true)
    if (isLoggedIn) {
      console.log('Initiating logout redirect...')
      window.location.href = logoutUrl
      setIsLoggedIn(false)
    } else {
      console.log('Initiating login redirect...')
      window.location.href = loginUrl
    }
  }

  const navItems = [
    { name: 'Jobs', path: '/jobs' },
    { name: 'Dashboard', path: '/dashboard' },
  ]

  return (
    <header className="fixed top-0 w-full z-50 p-4 flex items-center justify-between bg-gray-100 text-gray-800 drop-shadow-lg">
      <nav className="flex items-center">
        <div className="px-4 font-bold text-xl">
          <div
            onClick={() => navigate({ to: '/' })}
            className="cursor-pointer hover:text-blue-600 transition duration-300"
          >
            Joblynk
          </div>
        </div>
      </nav>
      <div className="flex items-center space-x-4">
        {navItems.map((item) => (
          <div
            key={item.name}
            onClick={() => navigate({ to: item.path })}
            className={`cursor-pointer px-3 py-1 rounded-md transition duration-300 ${
              routerState.location.pathname.startsWith(item.path)
                ? 'bg-blue-200 text-black'
                : 'hover:bg-gray-200'
            }`}
          >
            {item.name}
          </div>
        ))}
        <button
          className="bg-blue-600 text-white p-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          onClick={handleAuthClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              {isLoggedIn ? 'Logging Out...' : 'Logging In...'}
            </div>
          ) : (
            <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
          )}
        </button>
      </div>
    </header>
  )
}
