import { Request, Response, NextFunction } from 'express'
import { eq } from 'drizzle-orm'

import { getBearerToken, validateJWT } from '../auth'
import config from '../config'
import { AuthorizationError } from '../types/errors'
import { db } from '../db'
import { users } from '../db/schema'

async function checkAdmin(req: Request, _res: Response, next: NextFunction) {
  const token = getBearerToken(req)
  const userId = validateJWT(token, config.jwt.secret)
  const [user] = await db.select().from(users).where(eq(users.id, userId))
  if (!user.isAdmin) {
    throw new AuthorizationError('Restricted for basic user')
  }
  next()
}

export default checkAdmin
