import { create } from 'zustand'

import { Subcategory } from '@/types/subcategory'
import { fetchRequest } from '@/utils/fetch_request'
import { useUserStore } from './user_store'

type Category = { id: string; label: string }

type CategoryStore = {
  categories: Record<string, Category> | undefined
  subcategories: Record<string, Subcategory> | undefined
  initialize: (data: Pick<CategoryStore, 'categories' | 'subcategories'>) => void
  unlockSubcategory: (subId: string) => Promise<void>
}

export const useCategoryStore = create<CategoryStore>()((set) => ({
  categories: undefined,
  subcategories: undefined,
  initialize: ({ categories, subcategories }) =>
    set(() => ({
      categories,
      subcategories,
    })),
  unlockSubcategory: async (subId) => {
    const token = useUserStore.getState().user?.token
    const res = await fetchRequest('/user_unlocks', 'POST', { subcategoryId: subId }, token)
    if (res.ok) {
      set((cur) => {
        const updatedSubcategories = { ...cur.subcategories }
        updatedSubcategories[subId].isUnlocked = true
        return { subcategories: updatedSubcategories }
      })
    } else console.log(res.error)
  },
}))
