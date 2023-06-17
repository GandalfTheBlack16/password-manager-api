import { User } from '../../../domain/User.js'
import { type UserRepository } from '../../../domain/repositories/UserRepository.js'
import { UserModel } from '../models/UserModel.js'

export class MongoUserRepository implements UserRepository {
  async getUsers () {
    const users = await UserModel.find()
    return users.map(item => {
      return new User(item.id, item.email, item.username, item.password)
    })
  }

  async getUserById (id: string) {
    return null
  }

  async getUserByEmail (email: string) {
    return null
  }

  async createUser (user: User) {
    if (await UserModel.exists({ email: user.getEmail }) ?? await UserModel.exists({ username: user.getUsername })) {
      return null
    }
    const userModel = new UserModel({
      _id: user.getId,
      email: user.getEmail,
      username: user.getUsername,
      password: user.getPassword
    })
    await userModel.save()
    return user
  }

  async updateUser (user: User) {
    return null
  }

  async deleteUser (user: User) {
  }
}
