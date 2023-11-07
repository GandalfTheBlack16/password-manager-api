import { type UserRepository } from '../domain/repositories/UserRepository.js'
import { UserDoesNotExistsException } from './exception/UserDoesNotExistsException.js'

export class UserUpdater {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async run ({ id, email, username }: { id: string, email?: string, username?: string }) {
    const user = await this.userRepository.getUserById(id)
    if (!user) {
      throw new UserDoesNotExistsException(id)
    }
    if (email) {
      user.modifyEmail(email)
    }
    if (username) {
      user.modifyUsername(username)
    }
    return await this.userRepository.updateUser(user)
  }
}
