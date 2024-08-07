import { UserCreator } from '../application/UserCreator.js'
import { CreateUserController } from './http/controllers/CreateUserController.js'
import { MongoUserRepository } from './db/repositories/MongoUserRepository.js'
import { UserFinder } from '../application/UserFinder.js'
import { AvailableUserController } from './http/controllers/AvailableUsersController.js'
import { LoginController } from './http/controllers/LoginController.js'
import { UserLogin } from '../application/UserLogin.js'
import { vaultCreator, vaultEraser } from '../../vault/infrastructure/dependencies.js'
import { DeleteUserController } from './http/controllers/DeleteUserController.js'
import { UserEraser } from '../application/UserEraser.js'
import { ChangeUserPasswordController } from './http/controllers/ChangeUserPasswordController.js'
import { UserPasswordUpdater } from '../application/UserPasswordUpdater.js'
import { UserUpdater } from '../application/UserUpdater.js'
import { UpdateUserController } from './http/controllers/UpdateUserController.js'
import { SendPasswordRestoreController } from './http/controllers/SendPasswordRestoreController.js'
import { restoreTokenCreator, restoreTokenValidator } from '../../restore-token/infraestructure/dependencies.js'
import { RestorePasswordController } from './http/controllers/RestorePasswordController.js'

const userRepository = new MongoUserRepository()

const userCreator = new UserCreator(userRepository)
const userListFinder = new UserFinder(userRepository)
const userLogin = new UserLogin(userRepository)
const userEraser = new UserEraser(userRepository)
const userUpdater = new UserUpdater(userRepository)
const userPasswordUpdater = new UserPasswordUpdater(userRepository)

const createUserController = new CreateUserController(userCreator, vaultCreator)
const availableUsersController = new AvailableUserController(userListFinder)
const loginController = new LoginController(userLogin)
const deleteUserController = new DeleteUserController(userEraser, vaultEraser)
const updateUserController = new UpdateUserController(userUpdater)
const changeUserPasswordController = new ChangeUserPasswordController(userPasswordUpdater)
const sendPasswordRestoreController = new SendPasswordRestoreController(userListFinder, restoreTokenCreator)
const restorePasswordController = new RestorePasswordController(restoreTokenValidator, userPasswordUpdater)

export {
  createUserController,
  availableUsersController,
  loginController,
  deleteUserController,
  updateUserController,
  changeUserPasswordController,
  sendPasswordRestoreController,
  restorePasswordController
}
