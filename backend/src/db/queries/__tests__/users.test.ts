import { describe, it, vi, expect, beforeAll } from 'vitest'

import { createUser, getUserByName, updateUser } from '../users'
import { NotFoundError } from 'src/types/errors'
import { hashPassword } from 'src/auth'

const USER_ID = 'a81bc81b-dead-4e5d-abff-90865d1e13b1'
const USERNAME = 'CactoHippoTanto'
const PASSWORD = 'password'

vi.mock('../../../db/index', () => {
  const userId = 'a81bc81b-dead-4e5d-abff-90865d1e13b1'
  const userResponse = {
    id: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    username: 'CactoHippoTanto',
    currency: 0,
  }

  return {
    db: {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn((updatedUserData: { [key: string]: any }) => ({
        where: vi.fn((isTrue: boolean) => {
          if (isTrue) {
            return {
              returning: vi
                .fn()
                .mockReturnValue([{ ...userResponse, ...updatedUserData }]),
            }
          } else {
            return { returning: vi.fn().mockReturnValue([]) }
          }
        }),
      })),
      returning: vi.fn().mockResolvedValue([userResponse]),
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnValue({
        where: vi.fn((isTrue: boolean) => {
          if (isTrue) {
            return [userResponse]
          } else {
            return []
          }
        }),
      }),
    },
  }
})

vi.mock('drizzle-orm', () => ({
  eq: (_: any, value: string) => {
    return value === USERNAME || value === USER_ID
  },
}))

describe('Creating user', () => {
  it('should return a user response in correct format', async () => {
    const result = await createUser(USERNAME, await hashPassword(PASSWORD))
    expect(result.id).toBeTypeOf('string')
    expect(result.createdAt).toBeTypeOf('string')
    expect(result.updatedAt).toBeTypeOf('string')
    expect(result.username).toEqual(USERNAME)
    expect(result.currency).toEqual(0)
  })
})

describe('Getting user by name', () => {
  it('should return a user response if it exists', async () => {
    const result = await getUserByName(USERNAME)
    expect(result.username).toEqual(USERNAME)
  })

  it("should throw NotFoundError if user doesn't exist", async () => {
    const fn = async () => await getUserByName('Nonexistent')
    await expect(fn()).rejects.toThrow(NotFoundError)
  })
})

describe('Updating user', () => {
  const updatedUserData = {
    username: 'Updatedname',
    hashedPassword: 'xyz',
    currency: 5,
  }
  it("should throw NotFoundError if user doesn't exist", async () => {
    const fn = async () => await updateUser('abc', updatedUserData)
    await expect(fn()).rejects.toThrow(NotFoundError)
  })

  it('should update all fields if provided', async () => {
    const result = await updateUser(USER_ID, updatedUserData)

    expect(result.username).toBe(updatedUserData.username)
    expect(result.currency).toBe(updatedUserData.currency)
  })

  it('should update only a specific field', async () => {
    const result = await updateUser(USER_ID, {
      currency: updatedUserData.currency,
    })

    expect(result.username).toBe(USERNAME)
    expect(result.currency).toBe(updatedUserData.currency)
  })
})
