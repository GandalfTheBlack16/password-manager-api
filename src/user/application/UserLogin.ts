import { type UserRepository } from '../domain/repositories/UserRepository.js'
import { generateJwt, verifyPassword } from '../../shared/application/crypto/CryptoUtils.js'
import { type LoginUserResponseDto } from './user-types.js'

export class UserLogin {
  constructor (private readonly userRepository: UserRepository) {}

  private readonly UNAUTHORIZED_RESPONSE = {
    status: 'Unauthorized',
    message: 'Invalid username/email or password'
  }

  async run ({ username, email, password }: { username: string, email: string, password: string }): Promise<LoginUserResponseDto> {
    const user = !username
      ? await this.userRepository.getUserByEmail(email)
      : await this.userRepository.getUserByUsername(username)
    if (!user) {
      return this.UNAUTHORIZED_RESPONSE
    }
    if (!verifyPassword(password, user.getPassword)) {
      return this.UNAUTHORIZED_RESPONSE
    }
    const accessToken = generateJwt({
      id: user.getId,
      email: user.getEmail,
      username: user.getUsername
    }, process.env.JWT_EXPIRATION_TIME)
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
