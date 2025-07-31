import { Request, Response, NextFunction } from 'express'

import { getBearerToken, validateJWT } from '../auth'
import config from '../config'
import { AuthorizationError } from '../types/errors'

function checkAdmin(req: Request, _res: Response, next: NextFunction) {
  const token = getBearerToken(req)
  const userId = validateJWT(token, config.jwt.secret)
  if (userId !== config.adminUserId) {
    throw new AuthorizationError('Restricted for basic user')
  }
  next()
}

export default checkAdmin
