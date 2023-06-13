import { type User } from '../../../src/user/domain/User.js'
import { type UserRepository } from '../../../src/user/domain/repositories/UserRepository.js'

export class UserRepositoryStub implements UserRepository {
  private userList: User[] = []

  async getUsers () {
    return this.userList
  }

  async getUserById (id: string) {
    const user = this.userList.find(item => item.getId === id)
    return user ?? null
  }

  async getUserByEmail (email: string) {
    const user = this.userList.find(item => item.getEmail === email)
    return user ?? null
  }

  async createUser (user: User) {
    if (this.userList.find(item => item.getId === user.getId) ?? this.userList.find(item => item.getEmail === user.getEmail)) {
      return null
    }
    this.userList.push(user)
    return user
  }

  async updateUser (user: User) {
    const index = this.userList.indexOf(user)
    if (index < 0) {
      return null
    }
    this.userList[index] = user
    return user
  }

  async deleteUser (user: User) {
    const updated = this.userList.filter(item => item.getId !== user.getId)
    this.userList = updated
  }
}
