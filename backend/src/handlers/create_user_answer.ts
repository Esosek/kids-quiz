import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

import { getBearerToken, validateJWT } from '../auth'
import config from '../config'
import { createUserAnswer } from '../db/queries/user_answers'
import { ValidationError } from '../types/errors'

export async function handlerCreateUserAnswer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getBearerToken(req)
    const userId = validateJWT(token, config.jwt.secret)
    const { questionId } = validateBody(req.body)

    const createdUserAnswer = await createUserAnswer(userId, questionId)

    res.status(201).json(createdUserAnswer)
  } catch (error) {
    next(error)
  }
}

function validateBody(reqBody: any): { questionId: string } {
  if (!reqBody) {
    throw new ValidationError('Missing request body')
  }

  if (
    !reqBody.questionId ||
    typeof reqBody.questionId !== 'string' ||
    !validator.isUUID(reqBody.questionId)
  ) {
    throw new ValidationError('Question ID is missing or in invalid format')
  }

  return { questionId: reqBody.questionId }
}
