import { and, eq } from 'drizzle-orm'

import { db } from '..'
import { userAnswers, type UserAnswer } from '../schema'
import { ValidationError } from '../../types/errors'

export async function createUserAnswer(
  userId: string,
  questionId: string
): Promise<UserAnswer> {
  try {
    const existingUserAnswer = await getUserAnswer(userId, questionId)
    if (existingUserAnswer) {
      throw new ValidationError(
        `Question ID ${questionId} already answered by user ${userId}`
      )
    }

    const [result] = await db
      .insert(userAnswers)
      .values({ userId, questionId })
      .returning()

    return result
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    throw new Error('Creating user answer failed')
  }
}

async function getUserAnswer(
  userId: string,
  questionId: string
): Promise<UserAnswer | undefined> {
  try {
    const [result] = await db
      .select()
      .from(userAnswers)
      .where(
        and(
          eq(userAnswers.userId, userId),
          eq(userAnswers.questionId, questionId)
        )
      )
    return result
  } catch (error) {
    throw new Error('Retrieving user unlock failed')
  }
}
