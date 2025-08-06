import { eq } from 'drizzle-orm'

import { NotFoundError, ValidationError } from '../../types/errors'
import { db } from '../../db/index'
import { categories, questions, subcategories, Subcategory } from '../schema'

export async function getSubcategories(): Promise<Subcategory[]> {
  try {
    return await db.select().from(subcategories)
  } catch (error) {
    throw new Error('Retrieving subcategories failed')
  }
}

export async function getSubcategoriesWithQuestionsAndCategories() {
  try {
    return await db
      .select({
        id: subcategories.id,
        label: subcategories.label,
        unlockPrice: subcategories.unlockPrice,
        categoryId: categories.id,
        categoryLabel: categories.label,
        questionId: questions.id,
        answer: questions.answer,
        questionImgUrl: questions.imgUrl,
        questionText: questions.text,
      })
      .from(subcategories)
      .leftJoin(categories, eq(subcategories.categoryId, categories.id))
      .leftJoin(questions, eq(subcategories.id, questions.subcategoryId))
  } catch (error) {
    throw new Error('Retrieving subcategories failed')
  }
}

export async function getFreeSubcategories(): Promise<Subcategory[]> {
  try {
    return await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.unlockPrice, 0))
  } catch (error) {
    throw new Error('Retrieving free subcategories failed')
  }
}

export async function createSubcategory(
  label: string,
  categoryId?: string,
  unlockPrice?: number
): Promise<Subcategory> {
  try {
    if (categoryId) {
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId))

      if (!category) {
        throw new NotFoundError('Category not found')
      }
    }

    const [createdSubcategory] = await db
      .insert(subcategories)
      .values({ label, categoryId, unlockPrice })
      .onConflictDoNothing()
      .returning()

    if (!createdSubcategory) {
      throw new ValidationError('Subcategory already exists')
    }
    return createdSubcategory
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error
    } else throw new Error('Creating subcategory failed')
  }
}

export async function getSubcategoryById(id: string): Promise<Subcategory> {
  try {
    const [subcategory] = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.id, id))

    if (!subcategory) {
      throw new NotFoundError(`Subcategory ${id} not found`)
    }
    return subcategory
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    } else throw new Error('Retrieving subcategory failed')
  }
}
