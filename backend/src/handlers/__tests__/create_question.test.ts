import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'

import { handlerCreateQuestion } from '../create_question'
import { AuthorizationError, ValidationError } from '../../types/errors'

const { MOCK_QUESTION, ADMIN, USER } = vi.hoisted(() => ({
  MOCK_QUESTION: {
    id: 'question_id',
    text: 'Co je to za značku?',
    answer: 'Zákaz vjezdu',
    imgUrl: 'http://url.net',
    subcategoryId: 'subcat_id',
  },
  ADMIN: 'admin',
  USER: 'user',
}))

vi.mock('../../db/queries/questions', () => ({
  createQuestion: vi.fn().mockReturnValue(MOCK_QUESTION),
}))

vi.mock('../../auth', () => ({
  getBearerToken: vi.fn((req: Request) => {
    return req.body?.isUser ? USER : ADMIN
  }),
  validateJWT: vi.fn((token: string) => (token === ADMIN ? ADMIN : USER)),
}))

vi.mock('../../config', () => ({
  default: {
    adminUserId: ADMIN,
    jwt: {
      secret: 'secret',
    },
  },
}))

describe('Create question', () => {
  const req = {
    body: {
      answer: MOCK_QUESTION.answer,
      imgUrl: MOCK_QUESTION.imgUrl,
      text: MOCK_QUESTION.text,
      subcategoryId: MOCK_QUESTION.subcategoryId,
    },
  } as unknown as Request

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response

  let next: any

  beforeEach(() => {
    next = vi.fn()
  })

  it('should create a question for admin user', async () => {
    await handlerCreateQuestion(req, res, next)

    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith(MOCK_QUESTION)
  })

  it('should create a question with only imgUrl', async () => {
    const req = {
      body: {
        answer: MOCK_QUESTION.answer,
        imgUrl: MOCK_QUESTION.imgUrl,
        subcategoryId: MOCK_QUESTION.subcategoryId,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith(MOCK_QUESTION)
  })

  it('should create a question with only text', async () => {
    const req = {
      body: {
        answer: MOCK_QUESTION.answer,
        text: MOCK_QUESTION.text,
        subcategoryId: MOCK_QUESTION.subcategoryId,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith(MOCK_QUESTION)
  })

  it('should fail to create a question for basic user', async () => {
    const req = {
      body: {
        isUser: true,
        answer: MOCK_QUESTION.answer,
        imgUrl: MOCK_QUESTION.imgUrl,
        subcategoryId: MOCK_QUESTION.subcategoryId,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(AuthorizationError)
    expect(firstCallArgument.message).toEqual('Restricted for basic user')
  })

  it('should fail to validate without request body', async () => {
    const req = {} as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Missing request body')
  })

  it('should fail to validate if answer is missing', async () => {
    const req = {
      body: {
        imgUrl: MOCK_QUESTION.imgUrl,
        subcategoryId: MOCK_QUESTION.subcategoryId,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Missing answer field')
  })

  it('should fail to validate if answer is in invalid format', async () => {
    const req = {
      body: {
        answer: 5,
        imgUrl: MOCK_QUESTION.imgUrl,
        subcategoryId: MOCK_QUESTION.subcategoryId,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Answer must be a string')
  })

  it('should fail to validate if both imgUrl and text is missing', async () => {
    const req = {
      body: {
        answer: MOCK_QUESTION.answer,
        subcategoryId: MOCK_QUESTION.subcategoryId,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual(
      'Missing both imgUrl and text field'
    )
  })

  it('should fail to validate if subcategoryId is missing', async () => {
    const req = {
      body: {
        answer: MOCK_QUESTION.answer,
        imgUrl: MOCK_QUESTION.imgUrl,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Missing subcategoryId field')
  })

  it('should fail to validate if subcategoryId is in invalid format', async () => {
    const req = {
      body: {
        answer: MOCK_QUESTION.answer,
        imgUrl: MOCK_QUESTION.imgUrl,
        subcategoryId: 123,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('SubcategoryId must be a string')
  })
})
