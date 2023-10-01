import { type UserRepository } from '../domain/repositories/UserRepository.js'

export class UserLogin {
  constructor (private readonly userRepository: UserRepository) {}

  async run ({ username, email, password }: { username: string, email: string, password: string }) {
    const user = !username
      ? await this.userRepository.getUserByEmail(email)
      : await this.userRepository.getUserByUsername(username)
    return user
  }
}
