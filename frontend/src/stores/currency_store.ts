import { fetchRequest } from '@/utils/fetch_request'
import { create } from 'zustand'
import { useUserStore } from './user_store'

type CurrencyStoreType = {
  currency: number
  addCurrency: (value?: number) => Promise<void>
  removeCurrency: (value?: number) => Promise<void>
  setCurrency: (value: number) => Promise<void>
  initializeCurrency: (value: number) => void
}

export const useCurrencyStore = create<CurrencyStoreType>()((set) => {
  return {
    currency: 0,
    addCurrency: async (value = 1) => {
      const updatedCurrency = useCurrencyStore.getState().currency + value
      const res = await fetchRequest<{ currency: number }>('/users', 'PUT', { currency: updatedCurrency }, useUserStore.getState().user?.token)
      if (res.ok && res.body) {
        set(() => ({ currency: res.body.currency }))
      } else console.error(res.error)
    },

    removeCurrency: async (value = 1) => {
      const updatedCurrency = useCurrencyStore.getState().currency - value
      if (updatedCurrency < 0) {
        throw new Error('Not enough currency')
      }
      const res = await fetchRequest<{ currency: number }>('/users', 'PUT', { currency: updatedCurrency }, useUserStore.getState().user?.token)
      if (res.ok && res.body) {
        set(() => ({ currency: res.body.currency }))
      } else console.error(res.error)
    },
    setCurrency: async (value) => {
      if (value < 0) {
        throw new Error("Currency can't be negative")
      }
      const res = await fetchRequest<{ currency: number }>('/users', 'PUT', { currency: value }, useUserStore.getState().user?.token)
      if (res.ok && res.body) {
        set(() => ({ currency: res.body.currency }))
      } else console.error(res.error)
    },
    initializeCurrency: (value) => set(() => ({ currency: value })),
  }
})
