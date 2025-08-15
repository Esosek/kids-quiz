import { create } from 'zustand'

import { Subcategory } from '@/types/subcategory'

type Category = { id: string; label: string }

type CategoryStore = {
  categories: Record<string, Category> | undefined
  subcategories: Record<string, Subcategory> | undefined
  initialize: (data: Pick<CategoryStore, 'categories' | 'subcategories'>) => void
}

export const useCategoryStore = create<CategoryStore>()((set) => ({
  categories: undefined,
  subcategories: undefined,
  initialize: ({ categories, subcategories }) =>
    set(() => ({
      categories,
      subcategories,
    })),
}))
