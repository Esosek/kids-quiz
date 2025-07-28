import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'

import { handlerCreateUser } from '../users_handler'

const userId = 'a81bc81b-dead-4e5d-abff-90865d1e13b1'
const username = 'CactoHippoTanto'
const hashedPassword = 'password'

const userResponse = {
  id: userId,
  createdAt: '',
  updatedAt: '',
  username,
  currency: 0,
}

let res: Response
let next: any

describe('Create users handler', () => {
  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response

    next = vi.fn()
    vi.mock('../../db/queries/users', () => {
      return {
        createUser: vi.fn(() => {
          return {
            id: userId,
            createdAt: '',
            updatedAt: '',
            username,
            currency: 0,
          }
        }),
      }
    })
  })
  it('should successfully create a user', async () => {
    const req = {
      body: {
        username,
        password: hashedPassword,
      },
    } as Request

    await handlerCreateUser(req, res, next)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      ...userResponse,
      username: req.body.username,
    })
  })

  it('should throw an error when username is missing', async () => {
    const req = {
      body: {
        password: hashedPassword,
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
        password: hashedPassword,
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
        password: hashedPassword,
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
        username,
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
        username,
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
        username,
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
