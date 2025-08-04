import { Request, Response, NextFunction } from 'express'
import validator from 'validator'

import { createSubcategory } from '../db/queries/subcategories'
import { ValidationError } from '../types/errors'

export async function handlerCreateSubcategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = validateInput(req.body)
    const createdSubcategory = await createSubcategory(
      body.label,
      body.categoryId,
      body.unlockPrice
    )
    res.status(201).json(createdSubcategory)
  } catch (error) {
    next(error)
  }
}

function validateInput(reqBody: any): {
  label: string
  categoryId?: string
  unlockPrice?: number
} {
  if (!reqBody) {
    throw new ValidationError('Missing request body')
  }

  if (!reqBody.label || typeof reqBody.label !== 'string') {
    throw new ValidationError('Label is missing or in invalid format')
  }

  if (reqBody.label.length < 4 || reqBody.label.length > 64) {
    throw new ValidationError('Label must be between 3 and 64 characters long')
  }

  if (reqBody.categoryId && !validator.isUUID(reqBody.categoryId)) {
    throw new ValidationError('CategoryId is in invalid format')
  }

  if (reqBody.unlockPrice && typeof reqBody.unlockPrice !== 'number') {
    throw new ValidationError('Unlock price is in invalid format')
  }
  return {
    label: reqBody.label,
    categoryId: reqBody.categoryId,
    unlockPrice: reqBody.unlockPrice,
  }
}
