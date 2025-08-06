import { Request, Response, NextFunction } from 'express'

import { getBearerToken, validateJWT } from '../auth'
import config from '../config'
import { getUserUnlocks } from '../db/queries/user_unlocks'
import { getUserById } from '../db/queries/users'
import { getCategories } from '../db/queries/categories'
import { type UserAnswer, type UserUnlock, type Category } from '../db/schema'
import { getSubcategoriesWithQuestionsAndCategories } from '../db/queries/subcategories'
import { getAnswersByUser } from '../db/queries/user_answers'

type SubcategoryDetail = {
  id: string
  label: string
  unlockPrice: number
  categoryId: string | null
  categoryLabel: string | null
  questionId: string | null
  answer: string | null
  questionImgUrl: string | null
  questionText: string | null
}

type SubcategoryDetailResponse = {
  label: string
  unlockPrice: number
  isUnlocked: boolean
  category: {
    id: string
    label: string
  } | null
  questions: {
    id: string
    answer: string
    imgUrl: string | null
    text: string | null
    hasUserAnswered: boolean
    subcategoryId: string
  }[]
}

export async function handlerInitialize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getBearerToken(req)
    const userId = validateJWT(token, config.jwt.secret)

    const { hashedPassword, ...user } = await getUserById(userId)

    const categories = processCategories(await getCategories())
    const subcategories = await getSubcategoriesWithQuestionsAndCategories()
    const userUnlocks = await getUserUnlocks(userId)
    const userAnswers = await getAnswersByUser(userId)
    const processedSubcategories = processSubcategoryData(
      subcategories,
      userUnlocks,
      userAnswers
    )

    res.status(200).json({
      user,
      categories,
      subcategories: processedSubcategories,
    })
  } catch (error) {
    next(error)
  }
}

function processCategories(categories: Category[]) {
  return categories.reduce((acc, current) => {
    const { id, ...data } = current
    acc[id] = data
    return acc
  }, {} as Record<string, Omit<Category, 'id'>>)
}

function processSubcategoryData(
  subcategories: SubcategoryDetail[],
  userUnlocks: UserUnlock[],
  userAnswers: UserAnswer[]
) {
  const unlocks = userUnlocks.reduce((acc, cur) => {
    acc[cur.subcategoryId] = cur
    return acc
  }, {} as Record<string, UserUnlock>)

  const answers = userAnswers.reduce((acc, cur) => {
    acc[cur.questionId] = cur
    return acc
  }, {} as Record<string, UserAnswer>)

  // Transform subcategory data to expected hierarchy
  return subcategories.reduce((acc, row) => {
    if (!acc[row.id]) {
      acc[row.id] = {
        label: row.label,
        unlockPrice: row.unlockPrice,
        isUnlocked: unlocks[row.id] ? true : false, // Mark unlocked subcategory if found in unlocks
        category: row.categoryId
          ? {
              id: row.categoryId!,
              label: row.categoryLabel!,
            }
          : null,
        questions: [],
      }
    }
    if (row.questionId) {
      acc[row.id].questions.push({
        id: row.questionId,
        answer: row.answer!,
        imgUrl: row.questionImgUrl,
        text: row.questionText,
        hasUserAnswered: answers[row.questionId] ? true : false,
        subcategoryId: row.id,
      })
    }

    return acc
  }, {} as Record<string, SubcategoryDetailResponse>)
}
