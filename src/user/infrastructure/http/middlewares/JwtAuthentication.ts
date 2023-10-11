import { type NextFunction, type Request, type Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { logger } from '../../../../shared/infrastructure/logger/Logger.js'

const JWT_SECRET = process.env.JWT_SECRET ?? '00000000'

export const jtwAthentication = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({
      status: 'Unauhtorized',
      message: 'Not authorization header provided'
    })
  }
  const token = extractToken(header)
  if (!token) {
    return res.status(401).json({
      status: 'Unauhtorized',
      message: 'Invalid authorization header provided'
    })
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload
    const { id, username, email } = payload
    req.query = { userId: id, username, email }
    next()
  } catch (error) {
    const message = (error as Error).message
    logger.error({ name: 'user-service' }, `Error verifying access token: ${message}`)
    return res.status(401).json({
      status: 'Unauhtorized',
      message: 'Invalid token provided'
    })
  }
}

const extractToken = (header: string) => {
  const regex = /^Bearer\s(.+)$/
  const match = header.match(regex)
  if (!match?.[1]) {
    return null
  }
  return match[1]
}
