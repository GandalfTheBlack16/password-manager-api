import { type UserRepository } from '../domain/repositories/UserRepository.js'

export class UserListFinder {
  constructor (private readonly userRepository: UserRepository) {}

  async run () {
    const userList = await this.userRepository.getUsers()
    return userList.map(item => {
      return {
        id: item.getId,
        email: item.getEmail,
        username: item.getUsername
      }
    })
  }
}
