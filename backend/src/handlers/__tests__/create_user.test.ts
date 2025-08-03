import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'

import { handlerCreateUser } from '../create_user'
import { ValidationError } from '../../types/errors'

const USER_ID = 'a81bc81b-dead-4e5d-abff-90865d1e13b1'
const USERNAME = 'CactoHippoTanto'
const HASHED_PASSWORD = 'password'
const AVATAR = 'monkey.png'

const userResponse = {
  id: USER_ID,
  createdAt: '',
  updatedAt: '',
  username: USERNAME,
  currency: 0,
  avatar: AVATAR,
}

vi.mock('../../auth', async (importOriginal) => {
  const original: any = await importOriginal()
  return {
    ...original,
    createJWT: vi.fn().mockReturnValue('jwt_token'),
  }
})

vi.mock('../../db/queries/user_unlocks', () => ({
  unlockFreeSubcategoriesForUser: vi.fn(),
}))

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
            avatar: AVATAR,
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
        avatar: AVATAR,
      },
    } as Request

    await handlerCreateUser(req, res, next)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      ...userResponse,
      token: 'jwt_token',
      username: req.body.username,
    })
  })

  it('should throw an error when username is missing', async () => {
    const req = {
      body: {
        password: HASHED_PASSWORD,
        avatar: AVATAR,
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
        avatar: AVATAR,
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
        avatar: AVATAR,
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
        avatar: AVATAR,
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
        avatar: AVATAR,
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
        avatar: AVATAR,
      },
    } as Request

    await handlerCreateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(Error)
    expect(firstCallArgument.message).toEqual(
      'Password must be between 8 and 64 characters long'
    )
  })

  it('should throw an error when avatar is missing', async () => {
    const req = {
      body: {
        username: USERNAME,
        password: HASHED_PASSWORD,
      },
    } as Request

    await handlerCreateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Missing avatar')
  })

  it('should throw an error when avatar is in invalid format', async () => {
    const req = {
      body: {
        username: USERNAME,
        password: HASHED_PASSWORD,
        avatar: 123456,
      },
    } as Request

    await handlerCreateUser(req, res, next)
    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Avatar is in invalid format')
  })
})
