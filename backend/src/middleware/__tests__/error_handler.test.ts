import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Response, Request } from 'express'

import errorHandler from '../error_handler'
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from '../../types/errors'

describe('errorHandler', () => {
  let res: Response
  const req = {} as Request
  const next = vi.fn()

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    } as unknown as Response
  })

  it('should call res.status with 400 when handling ValidationError', () => {
    const error = new ValidationError('Missing username')
    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: error.message })
  })

  it('should call res.status with 401 when handling AuthorizationError', () => {
    const error = new AuthenticationError('Unauthorized')
    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith({ error: error.message })
  })

  it('should call res.status with 403 when handling AuthorizationError', () => {
    const error = new AuthorizationError('Forbidden')
    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.send).toHaveBeenCalledWith('Forbidden')
  })

  it('should call res.status with 404 when handling NotFoundError', () => {
    const error = new NotFoundError('Username not found')
    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.send).toHaveBeenCalledWith({ error: error.message })
  })

  it('should call res.status with 500 when handling generic Error', () => {
    const error = new Error('')
    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Internal Server Error')
  })
})
