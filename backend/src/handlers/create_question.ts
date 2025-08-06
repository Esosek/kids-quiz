import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

import { ValidationError } from '../types/errors'
import { createQuestion, type QuestionInput } from '../db/queries/questions'

export async function handlerCreateQuestion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
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

  if (!reqBody.answers) {
    validationErrors.push('Missing answers field')
  } else if (!Array.isArray(reqBody.answers)) {
    validationErrors.push('Answers must be an array of strings')
  }

  if (!reqBody.subcategoryId) {
    validationErrors.push('Missing subcategoryId field')
  } else if (
    typeof reqBody.subcategoryId !== 'string' ||
    !validator.isUUID(reqBody.subcategoryId)
  ) {
    validationErrors.push('SubcategoryId must be an UUID')
  }

  if (!reqBody.imgUrl && !reqBody.text) {
    validationErrors.push('Missing both imgUrl and text field')
  }

  if (validationErrors.length) {
    throw new ValidationError(validationErrors.join(', '))
  }

  return {
    answers: reqBody.answers,
    subcategoryId: reqBody.subcategoryId,
    imgUrl: reqBody.imgUrl,
    text: reqBody.text,
  }
}
