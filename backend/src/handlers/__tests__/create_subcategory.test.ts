import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'

import { handlerCreateSubcategory } from '../create_subcategory'
import { ValidationError } from '../../types/errors'

const MOCK_SUBCATEGORY = vi.hoisted(() => ({
  id: 'eba2f80e-1f5b-40be-a5e6-b058eedb7471',
  label: 'Dopravní značky I',
  categoryId: 'b8150ff5-4733-4d78-a23b-3b6d5dd28a20',
  imageURL: 'https://image-url.net',
  unlockPrice: 50,
}))

vi.mock('../../db/queries/subcategories', () => ({
  createSubcategory: vi.fn((_label: string, _imageURL: string, categoryId: string) => {
    if (categoryId === undefined) {
      return { ...MOCK_SUBCATEGORY, categoryId: null }
    }
    return MOCK_SUBCATEGORY
  }),
}))

vi.mock('fs', () => ({
  default: {
    unlink: vi.fn(),
    readFileSync: vi.fn(),
  },
}))

vi.mock('firebase/storage', () => ({
  getDownloadURL: vi.fn().mockReturnValue(MOCK_SUBCATEGORY.imageURL),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
}))

vi.mock('../../firebase', () => ({
  storage: vi.fn(),
}))

describe('Create subcategory', () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response

  let next: any

  beforeEach(() => {
    next = vi.fn()
  })

  it('should create a subcategory with category', async () => {
    const req = {
      file: 'file',
      body: {
        label: MOCK_SUBCATEGORY.label,
        categoryId: MOCK_SUBCATEGORY.categoryId,
      },
    } as unknown as Request

    await handlerCreateSubcategory(req, res, next)

    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith(MOCK_SUBCATEGORY)
  })

  it('should create a subcategory without category', async () => {
    const req = {
      file: 'file',
      body: {
        label: MOCK_SUBCATEGORY.label,
      },
    } as unknown as Request

    await handlerCreateSubcategory(req, res, next)

    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith({
      ...MOCK_SUBCATEGORY,
      categoryId: null,
    })
  })

  it('should fail to validate without request body', async () => {
    const req = {
      file: 'file',
    } as unknown as Request
    await handlerCreateSubcategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Missing request body')
  })

  it('should fail to validate if label is missing', async () => {
    const req = {
      file: 'file',
      body: {},
    } as unknown as Request

    await handlerCreateSubcategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Label is missing or in invalid format')
  })

  it('should fail to validate if label is too short', async () => {
    const req = {
      file: 'file',
      body: {
        label: 'abc',
      },
    } as unknown as Request

    await handlerCreateSubcategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Label must be between 3 and 64 characters long')
  })

  it('should fail to validate if label is too long', async () => {
    const req = {
      file: 'file',
      body: {
        label: 'ImfMExPKlDNBZTtmaFYVJruMnDpZDFTtsQUeGPPUtyadVrNNniXzmpprHtxCONPgh',
      },
    } as unknown as Request

    await handlerCreateSubcategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Label must be between 3 and 64 characters long')
  })

  it('should fail to validate if label is in wrong format', async () => {
    const req = {
      file: 'file',
      body: {
        label: 666,
      },
    } as unknown as Request

    await handlerCreateSubcategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Label is missing or in invalid format')
  })

  it('should fail to validate if subcategoryId is in wrong format', async () => {
    const req = {
      file: 'file',
      body: {
        label: MOCK_SUBCATEGORY.label,
        categoryId: 'string',
      },
    } as unknown as Request

    await handlerCreateSubcategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('CategoryId is in invalid format')
  })

  it('should fail to validate if unlock price is in wrong format', async () => {
    const req = {
      file: 'file',
      body: {
        label: MOCK_SUBCATEGORY.label,
        unlockPrice: 'adsf50',
      },
    } as unknown as Request

    await handlerCreateSubcategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Unlock price is in invalid format')
  })

  it('should fail to validate if file is missing', async () => {
    const req = {
      body: {
        label: MOCK_SUBCATEGORY.label,
        unlockPrice: MOCK_SUBCATEGORY.unlockPrice,
      },
    } as unknown as Request

    await handlerCreateSubcategory(req, res, next)

    const firstCallArgument = next.mock.calls[0][0]

    expect(firstCallArgument).toBeInstanceOf(ValidationError)
    expect(firstCallArgument.message).toEqual('Missing image file')
  })
})
