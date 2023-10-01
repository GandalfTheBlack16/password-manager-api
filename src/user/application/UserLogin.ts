import { type UserRepository } from '../domain/repositories/UserRepository.js'
import { pbkdf2Sync } from 'crypto'
import { type JwtPayload } from './user-types.js'
import jwt from 'jsonwebtoken'

export class UserLogin {
  constructor (private readonly userRepository: UserRepository) {}

  private readonly UNAUTHORIZED_RESPONSE = {
    status: 'Unauthorized',
    message: 'Invalid username/email or password'
  }

  private readonly PASSWORD_SALT = process.env.PASSWORD_SALT ?? '00000000'
  private readonly JWT_SECRET = process.env.JWT_SECRET ?? '00000000'

  async run ({ username, email, password }: { username: string, email: string, password: string }) {
    const user = !username
      ? await this.userRepository.getUserByEmail(email)
      : await this.userRepository.getUserByUsername(username)
    if (!user) {
      return this.UNAUTHORIZED_RESPONSE
    }
    if (!this.verifyPassword(password, user.getPassword)) {
      return this.UNAUTHORIZED_RESPONSE
    }
    const accessToken = this.generateJwt({
      id: user.getId,
      email: user.getEmail,
      username: user.getUsername
    })
    return {
      status: 'Sucess',
      accessToken
    }
  }

  private verifyPassword (actualPassword: string, expectedPassword: string) {
    const hashedPassword = pbkdf2Sync(actualPassword, this.PASSWORD_SALT, 10000, 64, 'sha512').toString('hex')
    return hashedPassword === expectedPassword
  }

  private generateJwt (payload: JwtPayload) {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '1h'
    })
  }
}
