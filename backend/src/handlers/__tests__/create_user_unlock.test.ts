import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'

import { handlerCreateUserUnlock } from '../create_user_unlock'
import { ValidationError } from '../../types/errors'

const MOCK_USER_UNLOCK = vi.hoisted(() => ({
  id: 'eba2f80e-1f5b-40be-a5e6-b058eedb7471',
  userId: '31e88eb5-d613-40df-844d-cb4dae7bf70b',
  subcategoryId: '5b99262e-bfac-4f0d-97a2-d58ffeac7e5c',
}))

vi.mock('../../db/queries/user_unlocks', () => ({
  createUserUnlock: vi.fn().mockReturnValue(MOCK_USER_UNLOCK),
}))

vi.mock('../../auth', () => ({
  getBearerToken: vi.fn(),
  validateJWT: vi.fn().mockReturnValue(MOCK_USER_UNLOCK.userId),
}))

describe('Create user unlock', () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response

  let next: any

  beforeEach(() => {
    next = vi.fn()
  })

  it('should create a user unlock', async () => {
    const req = {
      body: {
        subcategoryId: MOCK_USER_UNLOCK.subcategoryId,
      },
    } as unknown as Request

    await handlerCreateUserUnlock(req, res, next)

    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith(MOCK_USER_UNLOCK)
  })

  it('should fail to create a user unlock with missing request body', async () => {
    const req = {} as unknown as Request

    await handlerCreateUserUnlock(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toBe('Missing request body')
  })

  it('should fail to create a user unlock with missing subcategoryId', async () => {
    const req = {
      body: {},
    } as unknown as Request

    await handlerCreateUserUnlock(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toBe(
      'Subcategory ID is missing or in invalid format'
    )
  })

  it('should fail to create a user unlock with invalid subcategoryId', async () => {
    const req = {
      body: {
        subcategoryId: 5,
      },
    } as unknown as Request

    await handlerCreateUserUnlock(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toBe(
      'Subcategory ID is missing or in invalid format'
    )
  })
})
