import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'

import { handlerCreateUserAnswer } from '../create_user_answer'
import { ValidationError } from '../../types/errors'

const MOCK_USER_ANSWER = vi.hoisted(() => ({
  id: 'eba2f80e-1f5b-40be-a5e6-b058eedb7471',
  userId: '31e88eb5-d613-40df-844d-cb4dae7bf70b',
  questionId: '5b99262e-bfac-4f0d-97a2-d58ffeac7e5c',
}))

vi.mock('../../auth', () => ({
  getBearerToken: vi.fn(),
  validateJWT: vi.fn().mockReturnValue(MOCK_USER_ANSWER.userId),
}))

vi.mock('../../db/queries/user_answers', () => ({
  createUserAnswer: vi.fn().mockReturnValue(MOCK_USER_ANSWER),
}))

describe('Creating user answer handler', () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response

  let next: any

  beforeEach(() => {
    next = vi.fn()
  })

  it('should create a new user answer', async () => {
    const req = {
      body: {
        questionId: MOCK_USER_ANSWER.questionId,
      },
    } as Request

    await handlerCreateUserAnswer(req, res, next)

    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith(MOCK_USER_ANSWER)
  })

  it('should fail to create a user answer if request body is missing', async () => {
    const req = {} as Request

    await handlerCreateUserAnswer(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toBe('Missing request body')
  })

  it('should fail to create a user answer when questionId is missing', async () => {
    const req = {
      body: {},
    } as Request

    await handlerCreateUserAnswer(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toBe(
      'Question ID is missing or in invalid format'
    )
  })

  it('should fail to create a user answer when questionId is in wrong format', async () => {
    const req = {
      body: {
        questionId: true,
      },
    } as Request

    await handlerCreateUserAnswer(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toBe(
      'Question ID is missing or in invalid format'
    )
  })
})
