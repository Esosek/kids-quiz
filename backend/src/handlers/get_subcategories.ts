import { Request, Response, NextFunction } from 'express'

import { getSubcategories } from '../db/queries/subcategories'

export async function handlerGetSubcategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await getSubcategories()
    res.status(200).json(categories)
  } catch (error) {
    next(error)
  }
}
