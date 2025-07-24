import { db } from '../index.js'
import { type User, users } from '../schema.js'

type UserResponse = Omit<User, 'hashedPassword'>

export async function createUser(user: User): Promise<UserResponse> {
  try {
    const [result] = await db
      .insert(users)
      .values({
        nickname: user.nickname,
        hashedPassword: 'unset',
        currency: user.currency,
      })
      .returning()
    const { hashedPassword, ...userResponse } = result
    return userResponse
  } catch (error) {
    throw new Error('Creating user failed')
  }
}
