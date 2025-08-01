import { and, eq } from 'drizzle-orm'

import { db } from '../../db/index'
import { users, userUnlocks, type UserUnlock } from '../../db/schema'
import { NotFoundError, ValidationError } from '../../types/errors'
import { getUserById } from './users'
import { getFreeSubcategories, getSubcategoryById } from './subcategories'

export async function createUserUnlock(
  userId: string,
  subcategoryId: string
): Promise<UserUnlock> {
  try {
    const existingUnlock = await getUserUnlock(userId, subcategoryId)
    if (existingUnlock) {
      throw new ValidationError(
        `Subcategory with ID ${subcategoryId} is already unlocked`
      )
    }

    const { currency } = await getUserById(userId)
    const { unlockPrice } = await getSubcategoryById(subcategoryId)

    const updatedCurrency = currency - unlockPrice

    if (updatedCurrency < 0) {
      throw new ValidationError('Not enough currency')
    }

    const [result] = await db
      .insert(userUnlocks)
      .values({ userId, subcategoryId })
      .returning()

    await db.update(users).set({ currency: updatedCurrency })

    return result
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error
    }
    throw new Error('Creating user unlock failed')
  }
}

export async function unlockFreeSubcategoriesForUser(userId: string) {
  const freeSubcategories = await getFreeSubcategories()

  freeSubcategories.forEach(async (sub) => {
    await createUserUnlock(userId, sub.id)
  })
}

async function getUserUnlock(
  userId: string,
  subcategoryId: string
): Promise<UserUnlock | undefined> {
  try {
    const [result] = await db
      .select()
      .from(userUnlocks)
      .where(
        and(
          eq(userUnlocks.userId, userId),
          eq(userUnlocks.subcategoryId, subcategoryId)
        )
      )

    return result
  } catch (error) {
    throw new Error('Retrieving user unlock failed')
  }
}
