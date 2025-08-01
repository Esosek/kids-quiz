import { describe, it, expect, vi, beforeEach } from 'vitest'

import { ValidationError, NotFoundError } from '../../../types/errors'
import { createUserUnlock } from '../user_unlocks'

const MOCK_USER_UNLOCK = vi.hoisted(() => ({
  id: 'eba2f80e-1f5b-40be-a5e6-b058eedb7471',
  userId: '31e88eb5-d613-40df-844d-cb4dae7bf70b',
  subcategoryId: '5b99262e-bfac-4f0d-97a2-d58ffeac7e5c',
}))

vi.mock('../users', () => ({
  getUserById: vi.fn().mockReturnValue({ currency: 50 }),
}))

vi.mock('../subcategories', () => ({
  getSubcategoryById: vi.fn((id: string) => {
    return { unlockPrice: id === MOCK_USER_UNLOCK.subcategoryId ? 10 : 100 }
  }),
}))

vi.mock('../../index', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnValue([MOCK_USER_UNLOCK]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn(),
  },
}))

describe('Create user unlock query', () => {
  it('should create a user unlock', async () => {
    const userUnlock = await createUserUnlock(
      MOCK_USER_UNLOCK.userId,
      MOCK_USER_UNLOCK.subcategoryId
    )

    expect(userUnlock).toBe(MOCK_USER_UNLOCK)
  })

  it('should fail to create a user unlock with insufficient currency', async () => {
    const fn = async () =>
      await createUserUnlock(MOCK_USER_UNLOCK.userId, '123')

    await expect(fn()).rejects.toThrow(ValidationError)
  })
})
