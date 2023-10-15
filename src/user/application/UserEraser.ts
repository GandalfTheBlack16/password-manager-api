import { type UserRepository } from '../domain/repositories/UserRepository.js'
import { UserDoesNotExistsException } from './exception/UserDoesNotExistsException.js'

export class UserEraser {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async run (userId: string) {
    if (!await this.userRepository.deleteUser(userId)) {
      throw new UserDoesNotExistsException(userId)
    }
  }
}
