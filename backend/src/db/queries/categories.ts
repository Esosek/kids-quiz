import { ValidationError } from '../../types/errors'
import { db } from '../../db/index'
import { categories, type Category } from '../../db/schema'

export async function getCategories(): Promise<Category[]> {
  try {
    return await db.select().from(categories)
  } catch (error) {
    throw new Error('Retrieving categories failed')
  }
}

export async function createCategory(label: string): Promise<Category> {
  try {
    const [result] = await db
      .insert(categories)
      .values({ label })
      .onConflictDoNothing()
      .returning()

    if (!result) {
      throw new ValidationError('Category already exists')
    }
    return result
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    } else throw new Error('Creating category failed')
  }
}
