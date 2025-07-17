import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  AUTH_LOGIN_ENDPOINT,
  AUTH_LOGOUT_ENDPOINT,
  getFullApiUrl,
} from '../constants/api'
import useStore from '../store'

export default function NavBar() {
  const navigate = useNavigate()
  const loginUrl = getFullApiUrl(AUTH_LOGIN_ENDPOINT)
  const logoutUrl = getFullApiUrl(AUTH_LOGOUT_ENDPOINT)
  const [isLoading, setIsLoading] = useState(false)
  const isLoggedIn = useStore((state) => state.isLoggedIn)

  const handleAuthClick = () => {
    setIsLoading(true)
    if (isLoggedIn) {
      console.log('Initiating logout redirect...')
      window.location.href = logoutUrl
    } else {
      console.log('Initiating login redirect...')
      window.location.href = loginUrl
    }
  }

  return (
    <header className="p-4 flex items-center justify-between bg-gray-100 text-gray-800 z-10 drop-shadow-lg">
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
      <div>
        <button
          className="bg-blue-600 text-white p-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={handleAuthClick}
          disabled={isLoading}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </div>
    </header>
  )
}
