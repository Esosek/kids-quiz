import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'

import { handlerCreateCategory } from '../create_category'
import { ValidationError } from '../../types/errors'

const MOCK_CATEGORY = vi.hoisted(() => ({
  id: 'eba2f80e-1f5b-40be-a5e6-b058eedb7471',
  label: 'Dopravní značky',
}))

vi.mock('../../db/queries/categories', () => ({
  createCategory: vi.fn().mockReturnValue(MOCK_CATEGORY),
}))

describe('Create category', () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response

  let next: any

  beforeEach(() => {
    next = vi.fn()
  })

  it('should create a category', async () => {
    const req = {
      body: {
        label: MOCK_CATEGORY.label,
      },
    } as unknown as Request

    await handlerCreateCategory(req, res, next)

    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith(MOCK_CATEGORY)
  })

  it('should fail to validate without request body', async () => {
    const req = {} as unknown as Request
    await handlerCreateCategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Missing request body')
  })

  it('should fail to validate if label is missing', async () => {
    const req = {
      body: {},
    } as unknown as Request

    await handlerCreateCategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual(
      'Label is missing or in invalid format'
    )
  })

  it('should fail to validate if label is too short', async () => {
    const req = {
      body: {
        label: 'abc',
      },
    } as unknown as Request

    await handlerCreateCategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual(
      'Label must be between 3 and 64 characters long'
    )
  })

  it('should fail to validate if label is too long', async () => {
    const req = {
      body: {
        label:
          'ImfMExPKlDNBZTtmaFYVJruMnDpZDFTtsQUeGPPUtyadVrNNniXzmpprHtxCONPgh',
      },
    } as unknown as Request

    await handlerCreateCategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual(
      'Label must be between 3 and 64 characters long'
    )
  })

  it('should fail to validate if label is in wrong format', async () => {
    const req = {
      body: {
        label: 666,
      },
    } as unknown as Request

    await handlerCreateCategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual(
      'Label is missing or in invalid format'
    )
  })
})
