import { type User } from '../../../src/user/domain/User.js'
import { type UserRepository } from '../../../src/user/domain/repositories/UserRepository.js'

export class UserRepositoryStub implements UserRepository {
  private userList: User[] = []

  async getUsers () {
    return this.userList
  }

  async getUserById (id: string) {
    return await new Promise<User | null>((resolve) => {
      const user = this.userList.find(item => item.getId === id)
      resolve(user ?? null)
    })
  }

  async getUserByEmail (email: string) {
    return await new Promise<User | null>((resolve) => {
      const user = this.userList.find(item => item.getEmail === email)
      resolve(user ?? null)
    })
  }

  async getUserByUsername (username: string) {
    return await new Promise<User | null>((resolve) => {
      const user = this.userList.find(item => item.getUsername === username)
      resolve(user ?? null)
    })
  }

  async createUser (user: User) {
    return await new Promise<User | null>((resolve) => {
      if (this.userList.find(item => item.getId === user.getId) ?? this.userList.find(item => item.getEmail === user.getEmail)) {
        resolve(null)
      }
      this.userList.push(user)
      resolve(user)
    })
  }

  async updateUser (user: User) {
    return await new Promise<User | null>((resolve) => {
      const index = this.userList.indexOf(user)
      if (index < 0) {
        resolve(null)
      }
      this.userList[index] = user
      resolve(user)
    })
  }

  async deleteUser (id: string) {
    await new Promise<void>((resolve) => {
      const updated = this.userList.filter(item => item.getId !== id)
      this.userList = updated
      resolve()
    })
  }
}
