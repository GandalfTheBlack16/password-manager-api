import { UserCreator } from '../application/UserCreator.js'
import { CreateUserController } from './http/controllers/CreateUserController.js'
import { MongoUserRepository } from './db/repositories/MongoUserRepository.js'
import { UserFinder } from '../application/UserFinder.js'
import { FindUserController } from './http/controllers/FindUsersController.js'
import { LoginController } from './http/controllers/LoginController.js'
import { UserLogin } from '../application/UserLogin.js'

const userRepository = new MongoUserRepository()

const userCreator = new UserCreator(userRepository)
const userListFinder = new UserFinder(userRepository)
const userLogin = new UserLogin(userRepository)

const createUserController = new CreateUserController(userCreator)
const findUsersController = new FindUserController(userListFinder)
const loginController = new LoginController(userLogin)

export {
  createUserController,
  findUsersController,
  loginController
}
