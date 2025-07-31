import { NextFunction, Request, Response } from 'express'

import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from '../types/errors'

function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.log(`${err.constructor.name}: ${err.message}`)
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message })
  } else if (err instanceof AuthenticationError) {
    res.status(401).send({ error: err.message })
  } else if (err instanceof AuthorizationError) {
    res.status(403).send('Forbidden')
  } else if (err instanceof NotFoundError) {
    res.status(404).send('Not Found')
  } else {
    res.status(500).send('Internal Server Error')
  }
}

function logError(error: any) {
  console.log(error.name)
}

export default errorHandler
