import { UserCreator } from '../application/UserCreator.js'
import { CreateUserController } from './http/controllers/CreateUserController.js'
import { MongoUserRepository } from './db/repositories/MongoUserRepository.js'
import { UserFinder } from '../application/UserFinder.js'
import { FindUserController } from './http/controllers/FindUsersController.js'
import { LoginController } from './http/controllers/LoginController.js'
import { UserLogin } from '../application/UserLogin.js'
import { vaultCreator } from '../../vault/infrastructure/dependencies.js'
import { DeleteUserController } from './http/controllers/DeleteUserController.js'
import { UserEraser } from '../application/UserEraser.js'
import { ChangeUserPasswordController } from './http/controllers/ChangeUserPasswordController.js'
import { UserPasswordUpdater } from '../application/UserPasswordUpdater.js'

const userRepository = new MongoUserRepository()

const userCreator = new UserCreator(userRepository)
const userListFinder = new UserFinder(userRepository)
const userLogin = new UserLogin(userRepository)
const userEraser = new UserEraser(userRepository)
const userPasswordUpdater = new UserPasswordUpdater(userRepository)

const createUserController = new CreateUserController(userCreator, vaultCreator)
const findUsersController = new FindUserController(userListFinder)
const loginController = new LoginController(userLogin)
const deleteUserController = new DeleteUserController(userEraser)
const changeUserPasswordController = new ChangeUserPasswordController(userPasswordUpdater)

export {
  createUserController,
  findUsersController,
  loginController,
  deleteUserController,
  changeUserPasswordController
}
