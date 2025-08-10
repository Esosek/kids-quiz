import { Question } from './question'

export type Subcategory = {
  label: string
  unlockPrice: number
  isUnlocked: boolean
  category: { id: string; label: string }
  questions: Question[]
}
