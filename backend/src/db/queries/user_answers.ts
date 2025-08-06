import { and, eq } from 'drizzle-orm'

import { db } from '..'
import { userAnswers, userUnlocks, type UserAnswer } from '../schema'
import { ValidationError } from '../../types/errors'
import { getQuestionById } from './questions'

export async function createUserAnswer(
  userId: string,
  questionId: string
): Promise<UserAnswer> {
  try {
    if (!(await isQuestionUnlockedByUser(questionId, userId))) {
      throw new ValidationError(
        `Question ${questionId} was not found in unlocked subcategories`
      )
    }
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

export async function getAnswersByUser(userId: string): Promise<UserAnswer[]> {
  try {
    return await db
      .select()
      .from(userAnswers)
      .where(eq(userAnswers.userId, userId))
  } catch (error) {
    throw new Error(`Retrieving answers for user ${userId} failed`)
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

async function isQuestionUnlockedByUser(
  questionId: string,
  userId: string
): Promise<boolean> {
  try {
    const question = await getQuestionById(questionId)
    const [result] = await db
      .select()
      .from(userUnlocks)
      .where(
        and(
          eq(userUnlocks.userId, userId),
          eq(userUnlocks.subcategoryId, question.subcategoryId)
        )
      )
    return result ? true : false
  } catch (error) {
    return false
  }
}
