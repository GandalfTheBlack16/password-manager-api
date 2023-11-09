import { type NextFunction, type Request, type Response } from 'express'
import { logger } from '../../../../shared/infrastructure/logger/Logger.js'
import { verifyJwt } from '../../../../shared/application/crypto/CryptoUtils.js'
import jwt from 'jsonwebtoken'

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
    const payload = verifyJwt(token)
    const { id: userId } = payload
    req.query = { ...req.query, userId }
    next()
  } catch (error) {
    const loggingMessage = (error as Error).message
    logger.error({ name: 'user-service' }, `Error verifying access token: ${loggingMessage}`)
    const message = error instanceof jwt.TokenExpiredError ? 'Access token has expired' : 'Invalid token provided'
    return res.status(401).json({
      status: 'Unauhtorized',
      message
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
