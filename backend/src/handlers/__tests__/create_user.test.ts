import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'

import { handlerCreateUser } from '../create_user'

const USER_ID = 'a81bc81b-dead-4e5d-abff-90865d1e13b1'
const USERNAME = 'CactoHippoTanto'
const HASHED_PASSWORD = 'password'

const userResponse = {
  id: USER_ID,
  createdAt: '',
  updatedAt: '',
  username: USERNAME,
  currency: 0,
}

vi.mock('../../auth', async (importOriginal) => {
  const original: any = await importOriginal()
  return {
    ...original,
    createJWT: vi.fn().mockReturnValue('jwt_token'),
  }
})

describe('Create user handler', () => {
  let res: Response
  let next: any
  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      cookie: vi.fn(),
    } as unknown as Response

    next = vi.fn()
    vi.mock('../../db/queries/users', () => {
      return {
        createUser: vi.fn(() => {
          return {
            id: USER_ID,
            createdAt: '',
            updatedAt: '',
            username: USERNAME,
            currency: 0,
          }
        }),
      }
    })
  })
  it('should successfully create a user', async () => {
    const req = {
      body: {
        username: USERNAME,
        password: HASHED_PASSWORD,
      },
    } as Request

    await handlerCreateUser(req, res, next)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      // JWT token is there
      ...userResponse,
      token: 'jwt_token',
      username: req.body.username,
    })
  })

  it('should throw an error when username is missing', async () => {
    const req = {
      body: {
        password: HASHED_PASSWORD,
      },
    } as Request

    await handlerCreateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(Error)
    expect(firstCallArgument.message).toEqual('Missing username')
  })

  it('should throw an error when username is too short', async () => {
    const req = {
      body: {
        username: 'AB',
        password: HASHED_PASSWORD,
      },
    } as Request

    await handlerCreateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(Error)
    expect(firstCallArgument.message).toEqual(
      'Username must be between 3 and 32 characters long'
    )
  })

  it('should throw an error when username is too long', async () => {
    const req = {
      body: {
        username: 'thisisa34characterslongusernamebro',
        password: HASHED_PASSWORD,
      },
    } as Request

    await handlerCreateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(Error)
    expect(firstCallArgument.message).toEqual(
      'Username must be between 3 and 32 characters long'
    )
  })

  it('should throw an error when password is missing', async () => {
    const req = {
      body: {
        username: USERNAME,
      },
    } as Request

    await handlerCreateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(Error)
    expect(firstCallArgument.message).toEqual('Missing password')
  })

  it('should throw an error when password is too short', async () => {
    const req = {
      body: {
        username: USERNAME,
        password: '1234567',
      },
    } as Request

    await handlerCreateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(Error)
    expect(firstCallArgument.message).toEqual(
      'Password must be between 8 and 64 characters long'
    )
  })

  it('should throw an error when password is too long', async () => {
    const req = {
      body: {
        username: USERNAME,
        password:
          '1HsYBnyeHpLTWDXlkt51esafPHZKPVkU6ynodziAI9NTRGhfJwmy6385n2UboTBoC',
      },
    } as Request

    await handlerCreateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(Error)
    expect(firstCallArgument.message).toEqual(
      'Password must be between 8 and 64 characters long'
    )
  })
})
