import { Request, Response, NextFunction } from 'express'

import { createCategory } from '../db/queries/categories'
import { ValidationError } from '../types/errors'

export async function handlerCreateCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = validateInput(req.body)
    const createdCategory = await createCategory(body.label)

    res.status(201).json(createdCategory)
  } catch (error) {
    next(error)
  }
}

function validateInput(reqBody: any): { label: string } {
  if (!reqBody) {
    throw new ValidationError('Missing request body')
  }

  if (!reqBody.label || typeof reqBody.label !== 'string') {
    throw new ValidationError('Label is missing or in invalid format')
  }

  if (reqBody.label.length < 4 || reqBody.label.length > 64) {
    throw new ValidationError('Label must be between 3 and 64 characters long')
  }
  return { label: reqBody.label }
}
