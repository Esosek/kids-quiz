import { describe, it, expect, beforeEach, beforeAll } from 'vitest'

import {
  hashPassword,
  createJWT,
  validateJWT,
  checkPasswordHash,
} from '../auth'
import { AuthenticationError } from '../types/errors'

describe('Password Hashing', () => {
  const password1 = 'correctPassword123!'
  const password2 = 'anotherPassword456!'
  let hash1: string

  beforeAll(async () => {
    hash1 = await hashPassword(password1)
  })

  it('should return true for the correct password', async () => {
    const result = await checkPasswordHash(password1, hash1)
    expect(result).toBe(true)
  })

  it('should return false for the wrong password', async () => {
    const result = await checkPasswordHash(password2, hash1)
    expect(result).toBe(false)
  })
})

describe('JWT authentication', () => {
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
