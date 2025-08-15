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
    // TODO: Connect addCurrency to backend
    set((cur) => ({ currency: cur.currency + value })),
  removeCurrency: async (value = 1) => {
    // TODO: Connect removeCurrency to backend
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
    // TODO: Connect setCurrency to backend
    set(() => {
      if (value < 0) {
        throw new Error("Currency can't be negative")
      }
      return { currency: value }
    }),
}))
