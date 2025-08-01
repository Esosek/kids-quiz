import { Request, Response, NextFunction } from 'express'

import { getCategories } from '../db/queries/categories'

export async function handlerGetCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await getCategories()
    res.status(200).json(categories)
  } catch (error) {
    next(error)
  }
}
