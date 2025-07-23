import { create } from 'zustand'

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
}

const useUserStore = create<UserState>((set) => ({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  setUserData: (firstName, lastName, email, role) =>
    set({ firstName, lastName, email, role }),
}))

export default useUserStore
