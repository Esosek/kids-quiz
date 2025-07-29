import { NextFunction, Request, Response } from 'express'

import config from '../config'
import { createUser } from '../db/queries/users'
import { ValidationError } from '../types/errors'
import { createJWT, hashPassword } from '../auth'

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
    const jwt = createJWT(userResponse.id, config.jwtSecret)
    const cookieAge = 1000 * 60 * 60 * 24 * 14 // 14 days

    res.cookie('kidsqz_l', jwt, {
      maxAge: cookieAge,
      httpOnly: true,
      secure: true,
    })
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
