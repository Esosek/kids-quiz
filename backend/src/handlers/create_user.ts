import { NextFunction, Request, Response } from 'express'

import config from '../config'
import { createUser } from '../db/queries/users'
import { ValidationError } from '../types/errors'
import { createJWT, hashPassword } from '../auth'
import { setResCookie } from '../utils'
import { unlockFreeSubcategoriesForUser } from '../db/queries/user_unlocks'

export async function handlerCreateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password } = validateInput(req.body)
    const userResponse = await createUser(
      username,
      await hashPassword(password)
    )
    await unlockFreeSubcategoriesForUser(userResponse.id)
    const jwt = createJWT(userResponse.id, config.jwt.secret)

    setResCookie(config.jwt.cookieName, jwt, res)
    res.status(201).json({ ...userResponse, token: jwt })
  } catch (error) {
    next(error)
  }
}

function validateInput(reqBody: any) {
  let validationErrors: string[] = []
  if (!reqBody.username) {
    validationErrors.push('Missing username')
  } else if (reqBody.username.length < 3 || reqBody.username.length > 32) {
    validationErrors.push('Username must be between 3 and 32 characters long')
  }

  if (!reqBody.password) {
    validationErrors.push('Missing password')
  } else if (reqBody.password.length < 8 || reqBody.password.length > 64) {
    validationErrors.push('Password must be between 8 and 64 characters long')
  }
  if (validationErrors.length) {
    throw new ValidationError(validationErrors.join(', '))
  }
  return { username: reqBody.username, password: reqBody.password }
}
