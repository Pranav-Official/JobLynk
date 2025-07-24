import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  firstName: string
  lastName: string
  email: string
  role: string
  setUserData: (
    firstName: string,
    lastName: string,
    email: string,
    role: string,
  ) => void
  clearUserData: () => void
  setUserRole: (role: string) => void
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      setUserData: (firstName, lastName, email, role) =>
        set({ firstName, lastName, email, role }),
      clearUserData: () =>
        set({ firstName: '', lastName: '', email: '', role: '' }),
      setUserRole: (role) => set({ role }),
    }),
    {
      name: 'user-storage',
    },
  ),
)

export default useUserStore
