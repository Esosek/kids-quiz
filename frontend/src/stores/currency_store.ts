import { create } from 'zustand'

type CurrencyStoreType = {
  currency: number
  addCurrency: (value?: number) => void
  removeCurrency: (value?: number) => void
  setCurrency: (value: number) => void
}

export const useCurrencyStore = create<CurrencyStoreType>()((set) => ({
  currency: 0,
  addCurrency: (value = 1) =>
    set((cur) => ({ currency: cur.currency + value })),
  removeCurrency: (value = 1) =>
    set((cur) => {
      if (cur.currency - value < 0) {
        throw new Error('Not enough currency')
      }
      return { currency: cur.currency - value }
    }),
  setCurrency: (value) =>
    set(() => {
      if (value < 0) {
        throw new Error("Currency can'nt be negative")
      }
      return { currency: value }
    }),
}))
