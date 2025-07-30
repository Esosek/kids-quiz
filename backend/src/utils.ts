import { Response } from 'express'

const COOKIE_AGE = 1000 * 60 * 60 * 24 * 14 // 14 days

export function setResCookie(
  name: string,
  value: string,
  res: Response,
  age?: number
) {
  res.cookie(name, value, {
    maxAge: age ?? COOKIE_AGE,
    httpOnly: true,
    secure: true,
  })
}
