import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes, createHash } from 'crypto'
import dotenv from 'dotenv'
import { type JwtPayload } from './crypto-types.js'
import jwt from 'jsonwebtoken'

dotenv.config()

const PASSWORD_SALT = process.env.PASSWORD_SALT ?? '00000000'
const JWT_SECRET = process.env.JWT_SECRET ?? '00000000'
const INIT_VETOR = process.env.SECRET_IV ?? randomBytes(16)
const SECURITY_KEY = process.env.SECRET_SECURITY_KEY ?? randomBytes(32)
const encryptionAlgorithm = process.env.CIPHER_ALGORITHM ?? 'aes-256-cbc'

const encryptionKey = createHash('sha512')
  .update(SECURITY_KEY)
  .digest('hex')
  .substring(0, 32)

const encryptionIv = createHash('sha512')
  .update(INIT_VETOR)
  .digest('hex')
  .substring(0, 16)

export const hashPassword = (password: string) => {
  return pbkdf2Sync(password, PASSWORD_SALT, 10000, 64, 'sha512').toString('hex')
}

export const verifyPassword = (actualPassword: string, expectedPassword: string) => {
  const hashedPassword = pbkdf2Sync(actualPassword, PASSWORD_SALT, 10000, 64, 'sha512').toString('hex')
  return hashedPassword === expectedPassword
}

export const encryptData = (data: string) => {
  const cipher = createCipheriv(encryptionAlgorithm, encryptionKey, encryptionIv)
  return Buffer.from(
    cipher.update(data, 'utf-8', 'hex') + cipher.final('hex')
  ).toString('base64')
}

export const decryptData = (encryptedData: string) => {
  const buff = Buffer.from(encryptedData, 'base64')
  const decipher = createDecipheriv(encryptionAlgorithm, encryptionKey, encryptionIv)
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  )
}

export const generateJwt = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30m'
  })
}

export const verifyJwt = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}
