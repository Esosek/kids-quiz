import { Question } from './question'

export type Subcategory = {
  id: string
  label: string
  unlockPrice: number
  isUnlocked: boolean
  category: { id: string; label: string }
  questions: Question[]
}
