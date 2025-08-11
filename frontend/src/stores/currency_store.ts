import { create } from 'zustand'

type CurrencyStoreType = {
  currency: number
  addCurrency: (value?: number) => Promise<void>
  removeCurrency: (value?: number) => Promise<void>
  setCurrency: (value: number) => Promise<void>
}

export const useCurrencyStore = create<CurrencyStoreType>()((set) => ({
  currency: 0,
  addCurrency: async (value = 1) =>
    set((cur) => ({ currency: cur.currency + value })),
  removeCurrency: async (value = 1) => {
    // TODO: Implement removeCurrency on backend
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(true)
      }, 1500)
    )
    return set((cur) => {
      if (cur.currency - value < 0) {
        throw new Error('Not enough currency')
      }
      return { currency: cur.currency - value }
    })
  },
  setCurrency: async (value) =>
    set(() => {
      if (value < 0) {
        throw new Error("Currency can'nt be negative")
      }
      return { currency: value }
    }),
}))
