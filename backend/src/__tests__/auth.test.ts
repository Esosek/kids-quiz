import { describe, it, expect, beforeEach } from 'vitest'

import { hashPassword, createJWT, validateJWT } from '../auth'
import { AuthenticationError } from '../types/errors'

describe('Auth', () => {
  const password = 'password'
  it('should hash a password', async () => {
    const hashedPassword = await hashPassword(password)
    expect(hashedPassword).not.toEqual(password)
  })
})

describe('JWT', () => {
  const userId = '06b17ade-0f03-4de2-9f6e-d96c809504f6'
  const secret1 = 'ballerina'
  const secret2 = 'capuccina'
  let jwt = ''

  beforeEach(() => {
    jwt = createJWT(userId, secret1)
  })

  it('should create new signed JWT', () => {
    expect(jwt).toBeTypeOf('string')
  })

  it('should return userId with valid JWT', () => {
    const validateUserId = validateJWT(jwt, secret1)

    expect(validateUserId).toBe(userId)
  })

  it('should fail to verify JWT with wrong secret', () => {
    expect(() => validateJWT(jwt, secret2)).toThrowError()
  })

  it('should fail to verify an invalid JWT', () => {
    expect(() => validateJWT('fake_token', secret1)).toThrow(
      AuthenticationError
    )
  })

  it('should fail to verify an expired JWT', async () => {
    const expiresIn = 1
    const token = createJWT(userId, secret1, expiresIn)

    await new Promise((resolve) => {
      setTimeout(resolve, expiresIn * 1000 + 50)
    })

    expect(() => validateJWT(token, secret1)).toThrowError()
  })
})
