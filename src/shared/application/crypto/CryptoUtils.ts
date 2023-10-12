import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from 'crypto'
import { type JwtPayload } from './crypto-types.js'
import jwt from 'jsonwebtoken'

const PASSWORD_SALT = process.env.PASSWORD_SALT ?? '00000000'
const JWT_SECRET = process.env.JWT_SECRET ?? '00000000'
const CIPHER_ALGORITHM = 'aes-256-cbc'
const INIT_VETOR = randomBytes(16)
const SECURITY_KEY = randomBytes(32)

export const hashPassword = (password: string) => {
  return pbkdf2Sync(password, PASSWORD_SALT, 10000, 64, 'sha512').toString('hex')
}

export const verifyPassword = (actualPassword: string, expectedPassword: string) => {
  const hashedPassword = pbkdf2Sync(actualPassword, PASSWORD_SALT, 10000, 64, 'sha512').toString('hex')
  return hashedPassword === expectedPassword
}

export const encryptData = (data: string) => {
  const cipher = createCipheriv(CIPHER_ALGORITHM, SECURITY_KEY, INIT_VETOR)
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
}

export const decryptData = (encryptedData: string) => {
  const decipher = createDecipheriv(CIPHER_ALGORITHM, SECURITY_KEY, INIT_VETOR)
  return decipher.update(encryptedData, 'hex', 'utf-8') + decipher.final('utf8')
}

export const generateJwt = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30m'
  })
}

export const verifyJwt = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}
