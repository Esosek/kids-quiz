import { eq } from 'drizzle-orm'

import { db } from '../../db/index'
import { questions, subcategories, type Question } from '../schema'
import { NotFoundError } from '../../types/errors'

export type QuestionInput = {
  answers: string[]
  subcategoryId: string
  imgUrl?: string
  text?: string
}
// Correct answer must be first in answers array
export async function createQuestion(
  question: QuestionInput
): Promise<Question> {
  try {
    const [subcategory] = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.id, question.subcategoryId))

    if (!subcategory) {
      throw new NotFoundError(`Subcategory ${question.subcategoryId} not found`)
    }

    const [createdQuestion] = await db
      .insert(questions)
      .values({ correctAnswer: question.answers[0], ...question })
      .returning()
    return createdQuestion
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    } else throw new Error('Creating question failed')
  }
}

export async function getQuestionById(questionId: string): Promise<Question> {
  try {
    const [result] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId))
    return result
  } catch (error) {
    throw new Error('Retrieving question failed')
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
