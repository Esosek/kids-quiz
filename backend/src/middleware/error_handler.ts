import { NextFunction, Request, Response } from 'express'

import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from '../types/errors'

function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ValidationError) {
    // console.log(err.message)
    res.status(400).json({ error: err.message })
  } else if (err instanceof AuthenticationError) {
    // console.log(err.message)
    res.status(401).send('Unauthorized')
  } else if (err instanceof NotFoundError) {
    // console.log(err.message)
    res.status(404).send('Not Found')
  } else {
    // console.log(err)
    res.status(500).send('Internal Server Error')
  }
}

export default errorHandler
