import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

const useStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
}))

export default useStore
