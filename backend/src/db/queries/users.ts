import { eq } from 'drizzle-orm'

import { db } from '../../db/index'
import { type User, users } from '../../db/schema'
import { NotFoundError } from 'src/types/errors'
import { hashPassword } from 'src/auth'

type UserResponse = Omit<User, 'hashedPassword'>

export async function createUser(username: string, password: string): Promise<UserResponse> {
  try {
    const [result] = await db
      .insert(users)
      .values({ username, hashedPassword: await hashPassword(password) })
      .returning()
    const { hashedPassword, ...userResponse } = result
    return userResponse
  } catch (error) {
    console.log(error)
    throw new Error('Creating user failed')
  }
}

export async function getUserByName(username: string): Promise<UserResponse> {
  try {
    const [result] = await db.select().from(users).where(eq(users.username, username))
    if (!result) {
      throw new NotFoundError('User not found')
    }
    const { hashedPassword, ...userResponse } = result
    return userResponse
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    } else throw new Error('Retrieving user failed')
  }
}
