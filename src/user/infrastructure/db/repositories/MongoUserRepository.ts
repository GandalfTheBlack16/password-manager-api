import { User } from '../../../domain/User.js'
import { type UserRepository } from '../../../domain/repositories/UserRepository.js'
import { UserModel } from '../models/UserModel.js'

export class MongoUserRepository implements UserRepository {
  async getUsers () {
    const users = await UserModel.find()
    return users.map(item => {
      return new User(item._id, item.email, item.username, item.password)
    })
  }

  async getUserById (id: string) {
    const userModel = await UserModel.findById(id)
    if (!userModel) {
      return null
    }
    const { _id: userId, email, username, password } = userModel
    return new User(userId, email, username, password)
  }

  async getUserByEmail (email: string) {
    const userModel = await UserModel.findOne({ email })
    if (!userModel) {
      return null
    }
    const { _id: id, email: userEmail, username, password } = userModel
    return new User(id, userEmail, username, password)
  }

  async getUserByUsername (username: string) {
    const userModel = await UserModel.findOne({ username })
    if (!userModel) {
      return null
    }
    const { _id: id, email, username: userName, password } = userModel
    return new User(id, email, userName, password)
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
    const userModel = await UserModel.findOneAndUpdate(
      { _id: user.getId },
      {
        email: user.getEmail,
        username: user.getUsername,
        password: user.getPassword
      })
    if (!userModel) {
      return null
    }
    const { _id: id, email, username, password } = userModel
    return new User(id, email, username, password)
  }

  async deleteUser (id: string) {
    await UserModel.deleteOne({ _id: id })
  }
}
