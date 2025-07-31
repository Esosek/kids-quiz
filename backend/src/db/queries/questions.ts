import { eq } from 'drizzle-orm'

import { db } from '../../db/index'
import { questions, type Question } from '../schema'

type QuestionInput = {
  answer: string
  subcategoryId: string
  imgUrl?: string
  text?: string
}

export async function createQuestion(
  question: QuestionInput
): Promise<Question> {
  try {
    const [result] = await db.insert(questions).values(question).returning()
    return result
  } catch (error) {
    throw new Error('Creating question failed')
  }
}

export async function getQuestionsBySubcategory(subcategoryId: string) {
  try {
    const result = await db
      .select()
      .from(questions)
      .where(eq(questions.subcategoryId, subcategoryId))
    return result
  } catch (error) {
    throw new Error(
      `Retrieving questions for subcategory ${subcategoryId} failed`
    )
  }
}
