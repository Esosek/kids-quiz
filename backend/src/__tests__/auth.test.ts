import { describe, it, expect } from 'vitest'

import { hashPassword } from 'src/auth'

const password = 'password'

describe('Auth', () => {
  it('should hash a password', async () => {
    const hashedPassword = await hashPassword(password)
    expect(hashedPassword).not.toEqual(password)
  })
})
