import { create } from 'zustand'

import User from '@/types/user'

type UserStore = {
  user: User | null
  initializeUser: (user: User) => void
  login: (username: string, password: string) => void
  register: (username: string, password: string, avatar: string) => void
  logout: () => void
}

const MOCK_USER = {
  id: '123',
  username: 'Alfik',
  avatar: 'penguin.png',
  token: 'abcdtoken',
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  initializeUser: (user: User) => set(() => ({ user })),
  login: (username: string, password: string) =>
    set(() => {
      console.log(`Logging in as ${username}...`)
      localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY!, 'test')
      return { user: MOCK_USER }
    }),
  register: (username: string, password: string, avatar: string) => {},
  logout: () =>
    set(() => {
      localStorage.removeItem(process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY!)
      return { user: null }
    }),
}))
