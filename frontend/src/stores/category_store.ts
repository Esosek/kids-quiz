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
  answerQuestion: (subId: string, questionId: string) => Promise<void>
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
  answerQuestion: async (subId, questionId) => {
    const currentSubcategories = useCategoryStore.getState().subcategories
    if (currentSubcategories) {
      const questionIndex = currentSubcategories[subId].questions.findIndex((q) => q.id === questionId)
      // Already answered
      if (currentSubcategories[subId].questions[questionIndex].hasUserAnswered) {
        return
      }

      const token = useUserStore.getState().user?.token
      const res = await fetchRequest('/user_answers', 'POST', { questionId: questionId }, token)
      if (res.ok) {
        set((cur) => {
          const updatedSubcategories = { ...cur.subcategories }
          if (questionIndex > -1) {
            updatedSubcategories[subId].questions[questionIndex].hasUserAnswered = true
          }
          return { ...cur, subcategories: updatedSubcategories }
        })
      } else console.error(res.error)
    }
  },
}))
