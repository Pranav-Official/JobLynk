import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  firstName: string
  lastName: string
  email: string
  role: string
  recruiterId: string
  seekerId: string
  setUserData: (
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    recruiterId: string,
    seekerId: string,
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
      recruiterId: '',
      seekerId: '',
      setUserData: (firstName, lastName, email, role, recruiterId, seekerId) =>
        set({ firstName, lastName, email, role, recruiterId, seekerId }),
      clearUserData: () =>
        set({
          firstName: '',
          lastName: '',
          email: '',
          role: '',
          recruiterId: '',
          seekerId: '',
        }),
      setUserRole: (role) => set({ role }),
    }),
    {
      name: 'user-storage',
    },
  ),
)

export default useUserStore
