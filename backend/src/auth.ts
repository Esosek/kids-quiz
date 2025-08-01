import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { AuthenticationError } from './types/errors'
import { Request } from 'express'

const MAX_JWT_EXPIRATION = 60 * 60 * 24 * 14 // 14 days

export async function hashPassword(password: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(
      password,
      10,
      (err: any, hash: string | PromiseLike<string>) => {
        if (err) {
          reject(new Error('Failed to hash password'))
        }
        resolve(hash)
      }
    )
  })
}

export async function checkPasswordHash(
  password: string,
  hash: string
): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        reject(new Error('Failed to check password hash'))
      }
      resolve(result)
    })
  })
}

type Payload = Pick<jwt.JwtPayload, 'iss' | 'sub' | 'iat' | 'exp'>

export function createJWT(
  userId: string,
  secret: string,
  expiresIn = MAX_JWT_EXPIRATION
): string {
  const issuedAt = Math.floor(Date.now() / 1000)
  const payload: Payload = {
    iss: 'kids_quiz',
    sub: userId,
    iat: issuedAt,
    exp: issuedAt + expiresIn,
  }
  return jwt.sign(payload, secret)
}

/**
 * @returns userId
 * @throws AuthenticationError if JWT token is invalid
 * @throws Error if JWT is in invalid format
 *  */
export function validateJWT(token: string, secret: string): string {
  try {
    const payload = jwt.verify(token, secret)
    if (payload.sub && typeof payload.sub === 'string') {
      return payload.sub
    } else {
      throw new Error('JWT payload sub is missing or in wrong format')
    }
  } catch (err) {
    throw new AuthenticationError('JWT token is invalid')
  }
}

/**
 * @returns JWT token
 * @throws AuthenticationError if header is missing in request
 *  */
export function getBearerToken(req: Request) {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    throw new AuthenticationError('Authorization header is missing')
  }
  return authHeader.split(' ')[1]
}
