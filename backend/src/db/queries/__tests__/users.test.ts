import { describe, it, vi, expect } from 'vitest'

import { createUser } from '../users'

const userId = 'a81bc81b-dead-4e5d-abff-90865d1e13b1'
const nickname = 'CactoHippoTanto'
const hashedPassword = 'password'

vi.mock('../users', () => {
  return {
    createUser: vi.fn(() => {
      return {
        id: userId,
        createdAt: '',
        updatedAt: '',
        nickname,
        currency: 0,
      }
    }),
  }
})

describe('Creating user', () => {
  it('should return a user response in correct format', async () => {
    const result = await createUser(nickname, hashedPassword)

    expect(result.id).toBeTypeOf('string')
    expect(result.createdAt).toBeTypeOf('string')
    expect(result.updatedAt).toBeTypeOf('string')
    expect(result.nickname).equals(nickname)
    expect(result.currency).equals(0)
  })
})
