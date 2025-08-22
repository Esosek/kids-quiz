import { eq } from 'drizzle-orm'

import { db } from '../../db/index'
import { type User, users } from '../../db/schema'
import { NotFoundError, ValidationError } from '../../types/errors'

type UserResponse = Omit<User, 'hashedPassword'>

export async function createUser(username: string, password: string, avatar: string): Promise<UserResponse> {
  try {
    const [result] = await db
      .insert(users)
      .values({ username, hashedPassword: password, avatar })
      .onConflictDoNothing()
      .returning()
    if (!result) {
      throw new ValidationError('Hráč již existuje')
    }
    const { hashedPassword, ...userResponse } = result
    return userResponse
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    } else throw new Error('Creating user failed')
  }
}

export async function getUserByName(username: string): Promise<User> {
  try {
    const [result] = await db.select().from(users).where(eq(users.username, username))
    if (!result) {
      throw new NotFoundError('Uživatel neexistuje')
    }
    return result
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    } else throw new Error('Retrieving user failed')
  }
}

export async function getUserById(id: string): Promise<User> {
  try {
    const [result] = await db.select().from(users).where(eq(users.id, id))
    if (!result) {
      throw new NotFoundError('User not found')
    }
    return result
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    } else throw new Error('Retrieving user failed')
  }
}

type UserData = {
  username?: string
  hashedPassword?: string
  currency?: number
}

export async function updateUser(userId: string, userData: UserData): Promise<UserResponse> {
  try {
    if (userData.username) {
      const [result] = await db.select().from(users).where(eq(users.username, userData.username))
      if (result) {
        throw new ValidationError(`User ${userData.username} already exists`)
      }
    }
    const [result] = await db.update(users).set(userData).where(eq(users.id, userId)).returning()
    if (!result) {
      throw new NotFoundError('User not found')
    }
    const { hashedPassword, ...userResponse } = result
    return userResponse
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error
    } else throw new Error('Updating user failed')
  }
}
