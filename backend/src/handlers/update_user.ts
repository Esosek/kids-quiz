import { NextFunction, Request, Response } from 'express'

import config from '../config'
import { updateUser } from '../db/queries/users'
import { ValidationError } from '../types/errors'
import { getBearerToken, hashPassword, validateJWT } from '../auth'

export async function handlerUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getBearerToken(req)
    const userId = validateJWT(token, config.jwt.secret)
    const { username, password, currency } = validateInput(req.body)
    const hashedPassword = password && (await hashPassword(password))

    const updatedUser = await updateUser(userId, {
      username,
      hashedPassword,
      currency,
    })

    res.status(200).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

function validateInput(reqBody: any): {
  username?: string
  password?: string
  currency?: number
} {
  let validationErrors: string[] = []

  if (!reqBody) {
    throw new ValidationError('Missing request body')
  }

  if (reqBody.username?.length < 3 || reqBody.username?.length > 32) {
    validationErrors.push('Username must be between 3 and 32 characters long')
  }

  if (reqBody.password?.length < 8 || reqBody.password?.length > 64) {
    validationErrors.push('Password must be between 8 and 64 characters long')
  }

  if (reqBody.currency < 0) {
    validationErrors.push('Currency must not be negative')
  }

  if (validationErrors.length) {
    throw new ValidationError(validationErrors.join(', '))
  }
  return {
    username: reqBody.username,
    password: reqBody.password,
    currency: reqBody.currency,
  }
}
