import { ValidationError } from 'src/types/errors'
import { db } from '../../db/index'
import { subcategories, Subcategory } from '../schema'

export async function getSubcategories(): Promise<Subcategory[]> {
  try {
    return await db.select().from(subcategories)
  } catch (error) {
    throw new Error('Retrieving subcategories failed')
  }
}

export async function createSubcategory(
  label: string,
  categoryId?: string
): Promise<Subcategory> {
  try {
    const [result] = await db
      .insert(subcategories)
      .values({ label, categoryId })
      .onConflictDoNothing()
      .returning()
    return result
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    } else throw new Error('Creating subcategory failed')
  }
}
