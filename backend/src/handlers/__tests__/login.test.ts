import { describe, it, expect, vi, beforeAll, beforeEach, Mock } from 'vitest'
import { NextFunction, Request, Response } from 'express'

import { handlerLogin } from '../login'
import { hashPassword } from '../../auth'
import { AuthenticationError, NotFoundError } from '../../types/errors'

const { MOCK_USER } = vi.hoisted(() => ({
  MOCK_USER: {
    userId: 'a81bc81b-dead-4e5d-abff-90865d1e13b1',
    username: 'CactoHippoTanto',
    hashedPassword: 'password',
    token: 'jwt_token',
  },
}))

vi.mock('../../db/queries/users', () => ({
  getUserByName: vi.fn((username: string) => {
    if (username === MOCK_USER.username) {
      return MOCK_USER
    } else {
      throw new NotFoundError('User not found')
    }
  }),
}))

vi.mock('../../auth', async (importOriginal) => {
  const original: any = await importOriginal()
  return {
    ...original,
    createJWT: vi.fn().mockReturnValue(MOCK_USER.token),
  }
})

describe('Login handler', () => {
  beforeAll(async () => {
    MOCK_USER.hashedPassword = await hashPassword(MOCK_USER.hashedPassword)
  })
  beforeEach(() => {
    vi.clearAllMocks()
  })
  const req = {
    body: {
      username: MOCK_USER.username,
      password: MOCK_USER.hashedPassword,
    },
  } as Request

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    cookie: vi.fn(),
  } as unknown as Response

  const next = vi.fn()

  it('returns user response with jwt', async () => {
    await handlerLogin(req, res, next)
    const { hashedPassword, ...mockedUser } = MOCK_USER

    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith(mockedUser)
  })

  it('throws AuthenticationError with wrong password', async () => {
    const req = {
      body: {
        username: MOCK_USER.username,
        password: 'wrongpassword',
      },
    } as Request

    await handlerLogin(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]
    expect(firstCallArgument).toBeInstanceOf(AuthenticationError)
    expect(firstCallArgument.message).toEqual('Invalid password')
  })

  it('throws NotFoundError with invalid username', async () => {
    const req = {
      body: {
        username: 'nonexistent',
        password: MOCK_USER.hashedPassword,
      },
    } as Request

    await handlerLogin(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]
    expect(firstCallArgument).toBeInstanceOf(NotFoundError)
    expect(firstCallArgument.message).toEqual('User not found')
  })
})
