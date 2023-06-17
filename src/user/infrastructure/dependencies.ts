import { UserCreator } from '../application/UserCreator.js'
import { CreateUserController } from './http/controllers/CreateUserController.js'
import { MongoUserRepository } from './db/repositories/MongoUserRepository.js'
import { UserListFinder } from '../application/UserListFinder.js'
import { FindUserController } from './http/controllers/FindUsersController.js'

const userRepository = new MongoUserRepository()

const userCreator = new UserCreator(userRepository)
const userListFinder = new UserListFinder(userRepository)

const createUserController = new CreateUserController(userCreator)
const findUsersController = new FindUserController(userListFinder)

export {
  createUserController,
  findUsersController
}
