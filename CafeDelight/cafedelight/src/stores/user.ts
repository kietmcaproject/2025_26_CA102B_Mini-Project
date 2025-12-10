import { create } from 'zustand'

type User = {
  id: string
  name: string
  email: string
}

type UserState = {
  user: User | null
  setUser: (user: User, token: string) => void
  logout: () => void
}

export const useUser = create<UserState>((set) => ({
  user: null,

  setUser: (user, token) => {
    localStorage.setItem('token', token)   // ✅ SAVE REAL JWT
    set({ user })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null })
  },
}))
