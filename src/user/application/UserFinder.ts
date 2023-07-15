import { type UserRepository } from '../domain/repositories/UserRepository.js'
import { type FindUserDto } from './user-dto.js'

enum PropType {
  ID,
  EMAIL,
  USERNAME
}

export class UserFinder {
  constructor (private readonly userRepository: UserRepository) {}

  async run (filter?: FindUserDto) {
    if (filter) {
      const { id, username, email } = filter
      if (id) {
        return await this.getUserByAttribute(id, PropType.ID)
      }
      if (email) {
        return await this.getUserByAttribute(email, PropType.EMAIL)
      }
      if (username) {
        return await this.getUserByAttribute(username, PropType.USERNAME)
      }
    }
    const userList = await this.userRepository.getUsers()
    return userList.map(item => {
      return {
        id: item.getId,
        email: item.getEmail,
        username: item.getUsername
      }
    })
  }

  private async getUserByAttribute (prop: string, propType: PropType) {
    let filtered = null
    switch (propType) {
      case PropType.ID:
        filtered = await this.userRepository.getUserById(prop)
        break
      case PropType.EMAIL:
        filtered = await this.userRepository.getUserByEmail(prop)
        break
      case PropType.USERNAME:
        filtered = await this.userRepository.getUserByUsername(prop)
    }
    if (!filtered) {
      return []
    }
    return [{
      id: filtered.getId,
      email: filtered.getEmail,
      username: filtered.getUsername
    }]
  }
}
