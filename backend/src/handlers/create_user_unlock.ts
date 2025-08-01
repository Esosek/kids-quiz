import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

import { createUserUnlock } from '../db/queries/user_unlocks'
import { ValidationError } from '../types/errors'
import { getBearerToken, validateJWT } from '../auth'
import config from '../config'

export async function handlerCreateUserUnlock(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getBearerToken(req)
    const userId = validateJWT(token, config.jwt.secret)
    const { subcategoryId } = validateInput(req.body)

    const createdUserUnlock = await createUserUnlock(userId, subcategoryId)

    res.status(201).json(createdUserUnlock)
  } catch (error) {
    next(error)
  }
}

function validateInput(reqBody: any): { subcategoryId: string } {
  if (!reqBody) {
    throw new ValidationError('Missing request body')
  }

  if (
    !reqBody.subcategoryId ||
    typeof reqBody.subcategoryId !== 'string' ||
    !validator.isUUID(reqBody.subcategoryId)
  ) {
    throw new ValidationError('Subcategory ID is missing or in invalid format')
  }
  return { subcategoryId: reqBody.subcategoryId }
}
