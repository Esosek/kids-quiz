import { describe, it, vi, expect, beforeEach } from 'vitest'
import { Request, Response } from 'express'

import { handlerUpdateUser } from '../update_user'
import { ValidationError } from '../../types/errors'

const { MOCK_USER, TEST_PARAMS } = vi.hoisted(() => ({
  MOCK_USER: {
    id: '123',
    username: 'fish',
    currency: 0,
  },
  TEST_PARAMS: {
    username: 'yellow_fish',
    password: 'updated_password',
    currency: 2,
  },
}))

describe('Updating user', () => {
  let res: Response
  let next: any

  beforeEach(() => {
    vi.clearAllMocks()
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    } as unknown as Response
    next = vi.fn()
  })

  vi.mock('../../auth', () => ({
    getBearerToken: vi.fn(),
    validateJWT: vi.fn().mockReturnValue(MOCK_USER.id),
    hashPassword: vi.fn(),
  }))

  vi.mock('../../db/queries/users', () => ({
    updateUser: vi.fn(
      (
        userId: string,
        userData: {
          username?: string
          hashedPassword?: string
          currency?: number
        }
      ) => {
        return {
          id: userId,
          username: userData.username ?? MOCK_USER.username,
          currency: userData.currency ?? MOCK_USER.currency,
        }
      }
    ),
  }))

  it('should update all fields', async () => {
    const req = {
      body: {
        username: TEST_PARAMS.username,
        password: TEST_PARAMS.password,
        currency: TEST_PARAMS.currency,
      },
    } as Request

    await handlerUpdateUser(req, res, next)

    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({
      ...MOCK_USER,
      username: TEST_PARAMS.username,
      currency: TEST_PARAMS.currency,
    })
  })

  it('should update a single field', async () => {
    const req = {
      body: {
        currency: TEST_PARAMS.currency,
      },
    } as Request

    await handlerUpdateUser(req, res, next)

    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({
      ...MOCK_USER,
      currency: TEST_PARAMS.currency,
    })
  })

  it('should fail to update short username', async () => {
    const req = {
      body: {
        username: 'sh',
      },
    } as Request

    await handlerUpdateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toBe(
      'Username must be between 3 and 32 characters long'
    )
  })

  it('should fail to update long username', async () => {
    const req = {
      body: {
        username: 'MEINJQyvdBbnwXjQbaLPWxrTsCjeEnnB34',
      },
    } as Request

    await handlerUpdateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toBe(
      'Username must be between 3 and 32 characters long'
    )
  })

  it('should fail to update short password', async () => {
    const req = {
      body: {
        password: 'passwor',
      },
    } as Request

    await handlerUpdateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toBe(
      'Password must be between 8 and 64 characters long'
    )
  })

  it('should fail to update long password', async () => {
    const req = {
      body: {
        password:
          'MEINJQyvdBbnwXjQbaLPWxrTsCjeEnnBgraTEnRTFjZubJDlRgCpbdNVzIAaPofkx', // 65 chars
      },
    } as Request

    await handlerUpdateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toBe(
      'Password must be between 8 and 64 characters long'
    )
  })

  it('should fail to update to negative currency', async () => {
    const req = {
      body: {
        currency: -2,
      },
    } as Request

    await handlerUpdateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toBe('Currency must not be negative')
  })
})
