import { db } from '../../db/index'
import { users, userUnlocks, type UserUnlock } from '../../db/schema'
import { NotFoundError, ValidationError } from '../../types/errors'
import { getUserById } from './users'
import { getSubcategoryById } from './subcategories'

export async function createUserUnlock(
  userId: string,
  subcategoryId: string
): Promise<UserUnlock> {
  try {
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
