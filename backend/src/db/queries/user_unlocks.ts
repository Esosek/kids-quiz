import { db } from '../../db/index'
import {
  subcategories,
  users,
  userUnlocks,
  type UserUnlock,
} from '../../db/schema'
import { checkItemIdinDBTable } from '../utils'
import { NotFoundError } from '../../types/errors'

export async function createUserUnlock(
  userId: string,
  subcategoryId: string
): Promise<UserUnlock> {
  try {
    checkItemIdinDBTable(userId, users)
    checkItemIdinDBTable(subcategoryId, subcategories)

    const [result] = await db
      .insert(userUnlocks)
      .values({ userId, subcategoryId })
      .returning()
    return result
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    }
    throw new Error('Creating user unlock failed')
  }
}
