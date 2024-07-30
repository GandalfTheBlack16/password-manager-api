import { type UserRepository } from '../domain/repositories/UserRepository.js'
import { generateJwt, verifyPassword } from '../../shared/application/crypto/CryptoUtils.js'
import { type UserLoggerProps, type LoginUserResponseDto } from './user-types.js'

export class UserLogin {
  constructor (private readonly userRepository: UserRepository) {}

  private readonly UNAUTHORIZED_RESPONSE = {
    status: 'Unauthorized',
    message: 'Invalid username/email or password'
  }

  async run ({ username, email, password, keepLoggedIn }: UserLoggerProps): Promise<LoginUserResponseDto> {
    const user = !username
      ? await this.userRepository.getUserByEmail(email)
      : await this.userRepository.getUserByUsername(username)

    if (!user) {
      return this.UNAUTHORIZED_RESPONSE
    }
    if (!verifyPassword(password, user.getPassword)) {
      return this.UNAUTHORIZED_RESPONSE
    }

    const expirationTime = keepLoggedIn ? process.env.JWT_EXTENDED_EXPIRATION_TIME : process.env.JWT_EXPIRATION_TIME
    const accessToken = generateJwt({
      id: user.getId,
      email: user.getEmail,
      username: user.getUsername
    }, expirationTime)

    return {
      status: 'Sucess',
      accessToken,
      userInfo: {
        id: user.getId,
        email: user.getEmail,
        username: user.getUsername
      }
    }
  }
}
