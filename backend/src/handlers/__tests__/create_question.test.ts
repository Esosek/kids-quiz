import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'

import { handlerCreateQuestion } from '../create_question'
import { ValidationError } from '../../types/errors'

const MOCK_QUESTION = vi.hoisted(() => ({
  id: 'question_id',
  text: 'Co je to za značku?',
  correctAnswer: 'Zákaz vjezdu',
  answers: 'Zákaz vjezdu, Zákaz stání, Zákaz zastavení',
  imgUrl: 'http://url.net',
  subcategoryId: 'aa0c8333-5b4a-46fd-bdf1-fec0bb702dbf',
}))

vi.mock('../../db/queries/questions', () => ({
  createQuestion: vi.fn().mockReturnValue(MOCK_QUESTION),
}))

vi.mock('fs', () => ({
  default: {
    unlink: vi.fn(),
    readFileSync: vi.fn(),
  },
}))

vi.mock('firebase/storage', () => ({
  getDownloadURL: vi.fn().mockReturnValue(MOCK_QUESTION.imgUrl),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
}))

vi.mock('../../firebase', () => ({
  storage: vi.fn(),
}))

describe('Create question', () => {
  const req = {
    file: 'file',
    body: {
      answers: MOCK_QUESTION.answers,
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

  it('should create a question', async () => {
    await handlerCreateQuestion(req, res, next)

    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith(MOCK_QUESTION)
  })

  it('should create a question with only imgUrl', async () => {
    const req = {
      file: 'file',
      body: {
        answers: MOCK_QUESTION.answers,
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
      file: 'file',
      body: {
        answers: MOCK_QUESTION.answers,
        text: MOCK_QUESTION.text,
        subcategoryId: MOCK_QUESTION.subcategoryId,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith(MOCK_QUESTION)
  })

  it('should fail to validate without request body', async () => {
    const req = { file: 'file' } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Missing request body')
  })

  it('should fail to validate if answer is missing', async () => {
    const req = {
      file: 'file',
      body: {
        imgUrl: MOCK_QUESTION.imgUrl,
        subcategoryId: MOCK_QUESTION.subcategoryId,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Missing answers field')
  })

  it('should fail to validate if answer is in invalid format', async () => {
    const req = {
      file: 'file',
      body: {
        answers: 5,
        imgUrl: MOCK_QUESTION.imgUrl,
        subcategoryId: MOCK_QUESTION.subcategoryId,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Answers must be a string')
  })

  it('should fail to validate if both imgUrl and text is missing', async () => {
    const req = {
      body: {
        answers: MOCK_QUESTION.answers,
        subcategoryId: MOCK_QUESTION.subcategoryId,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Missing both image and text field')
  })

  it('should fail to validate if subcategoryId is missing', async () => {
    const req = {
      file: 'file',
      body: {
        answers: MOCK_QUESTION.answers,
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
      file: 'file',
      body: {
        answers: MOCK_QUESTION.answers,
        imgUrl: MOCK_QUESTION.imgUrl,
        subcategoryId: 123,
      },
    } as unknown as Request
    await handlerCreateQuestion(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('SubcategoryId must be an UUID')
  })
})
