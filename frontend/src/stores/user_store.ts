import { create } from 'zustand'

import User from '@/types/user'
import { fetchRequest } from '@/utils/fetch_request'
import { useCurrencyStore } from './currency_store'

type UserStore = {
  user: User | null
  initializeUser: (user: User) => void
  login: (username: string, password: string, keepLoggedIn?: boolean) => Promise<{ ok: boolean; error?: string }>
  register: (username: string, password: string, avatar: string, keepLoggedIn?: boolean) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

// const MOCK_USER = {
//   id: '123',
//   username: 'Alfik',
//   avatar: 'penguin.png',
//   token: 'abcdtoken',
// }

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  initializeUser: (user) => set(() => ({ user })),
  login: async (username, password, keepLoggedIn?) => {
    const res = await fetchRequest('/login', 'POST', {
      username,
      password,
    })

    if (res.ok) {
      const body = res.body as User & { currency: number }
      if (keepLoggedIn) {
        localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY!, body.token)
      }
      useCurrencyStore.getState().initializeCurrency(body.currency)
      set(() => ({
        user: {
          id: body.id,
          avatar: body.avatar,
          token: body.token,
          username: body.username,
        },
      }))
      return { ok: true }
    }
    return { ok: false, error: res.error }
  },

  register: async (username, password, avatar, keepLoggedIn?) => {
    const res = await fetchRequest('/users', 'POST', {
      username,
      password,
      avatar,
    })

    if (res.ok) {
      const body = res.body as User
      if (keepLoggedIn) {
        localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY!, body.token)
      }
      set(() => ({
        user: {
          id: body.id,
          avatar: body.avatar,
          token: body.token,
          username: body.username,
        },
      }))
      return { ok: true }
    }
    return { ok: false, error: res.error }
  },
  logout: () =>
    set(() => {
      localStorage.removeItem(process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY!)
      return { user: null }
    }),
}))
