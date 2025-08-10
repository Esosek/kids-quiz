export type Question = {
  id: string
  correctAnswer: string
  answers: string[]
  imgUrl: string | null
  text: string | null
  hasUserAnswered: boolean
  subcategoryId: string
}
