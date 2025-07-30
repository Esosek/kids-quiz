import { NextFunction, Request, Response } from 'express'

import { AuthenticationError, ValidationError } from '../types/errors'
import { getUserByName } from '../db/queries/users'
import { checkPasswordHash, createJWT } from '../auth'
import config from '../config'
import { setResCookie } from 'src/utils'

export async function handlerLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validatedBody = validateInput(req.body)
    const user = await getUserByName(validatedBody.username)
    const isPasswordCorrect = await checkPasswordHash(
      validatedBody.password,
      user.hashedPassword
    )
    if (!isPasswordCorrect) {
      throw new AuthenticationError('Invalid password')
    }
    const jwt = createJWT(user.id, config.jwt.secret)
    const { hashedPassword, ...userResponse } = user

    setResCookie(config.jwt.cookieName, jwt, res)
    res.status(200).json({ ...userResponse, token: jwt })
  } catch (error) {
    next(error)
  }
}

function validateInput(reqBody: any): { username: string; password: string } {
  const errors: string[] = []
  if (!reqBody.username || typeof reqBody.username !== 'string') {
    errors.push('Invalid or missing username')
  }

  if (!reqBody.password || typeof reqBody.password !== 'string') {
    errors.push('Invalid or missing password')
  }

  if (errors.length) {
    throw new ValidationError(errors.join(', '))
  }
  return { username: reqBody.username, password: reqBody.password }
}
