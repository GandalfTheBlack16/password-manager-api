import { hashPassword } from '../../shared/application/crypto/CryptoUtils.js'
import { type UserRepository } from '../domain/repositories/UserRepository.js'
import { UserDoesNotExistsException } from './exception/UserDoesNotExistsException.js'
import { UserPasswordNotMatchException } from './exception/UserPasswordNotMatchException.js'
import { type UpdatePasswordDto } from './user-types.js'

export class UserPasswordUpdater {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async run ({ userId, oldPassword, newPassword }: UpdatePasswordDto) {
    const user = await this.userRepository.getUserById(userId)
    if (!user) {
      throw new UserDoesNotExistsException(userId)
    }
    if (oldPassword && user.getPassword !== hashPassword(oldPassword)) {
      throw new UserPasswordNotMatchException(userId)
    }
    user.modifyPassword(hashPassword(newPassword))
    return await this.userRepository.updateUser(user)
  }
}
