import { db } from '../../db/index'
import { type User, users } from '../../db/schema'

type UserResponse = Omit<User, 'hashedPassword'>

export async function createUser(username: string, password: string): Promise<UserResponse> {
  try {
    const [result] = await db.insert(users).values({ username, hashedPassword: password }).returning()
    const { hashedPassword, ...userResponse } = result
    return userResponse
  } catch (error) {
    throw new Error('Creating user failed')
  }
}
