import { eq } from 'drizzle-orm'

import { NotFoundError, ValidationError } from '../../types/errors'
import { db } from '../../db/index'
import { categories, subcategories, Subcategory } from '../schema'

export async function getSubcategories(): Promise<Subcategory[]> {
  try {
    return await db.select().from(subcategories)
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
  categoryId?: string
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
      .values({ label, categoryId })
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
