import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

import config from '../config'
import { getBearerToken, validateJWT } from '../auth'
import { AuthorizationError, ValidationError } from '../types/errors'
import { createQuestion, type QuestionInput } from '../db/queries/questions'

export async function handlerCreateQuestion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getBearerToken(req)
    const userId = validateJWT(token, config.jwt.secret)
    if (userId !== config.adminUserId) {
      throw new AuthorizationError('Restricted for basic user')
    }

    const body = validateBody(req.body)
    const createdQuestion = await createQuestion(body)

    res.status(201).json(createdQuestion)
  } catch (error) {
    next(error)
  }
}

function validateBody(reqBody: any): QuestionInput {
  const validationErrors: string[] = []

  if (!reqBody) {
    throw new ValidationError('Missing request body')
  }

  if (!reqBody.answer) {
    validationErrors.push('Missing answer field')
  } else if (typeof reqBody.answer !== 'string') {
    validationErrors.push('Answer must be a string')
  }

  if (!reqBody.subcategoryId) {
    validationErrors.push('Missing subcategoryId field')
  } else if (!validator.isUUID(reqBody.subcategoryId)) {
    validationErrors.push('SubcategoryId must be an UUID')
  }

  if (!reqBody.imgUrl && !reqBody.text) {
    validationErrors.push('Missing both imgUrl and text field')
  }

  if (validationErrors.length) {
    throw new ValidationError(validationErrors.join(', '))
  }

  return {
    answer: reqBody.answer,
    subcategoryId: reqBody.subcategoryId,
    imgUrl: reqBody.imgUrl,
    text: reqBody.text,
  }
}
