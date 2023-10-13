import { UserCreator } from '../application/UserCreator.js'
import { CreateUserController } from './http/controllers/CreateUserController.js'
import { MongoUserRepository } from './db/repositories/MongoUserRepository.js'
import { UserFinder } from '../application/UserFinder.js'
import { FindUserController } from './http/controllers/FindUsersController.js'
import { LoginController } from './http/controllers/LoginController.js'
import { UserLogin } from '../application/UserLogin.js'
import { vaultCreator, vaultCredentialEraser, vaultCredentialUpdater, vaultFinder } from '../../vault/infrastructure/dependencies.js'
import { FindUserVaultsController } from './http/controllers/FindUserVaultsController.js'
import { UpdateUserCredentials } from './http/controllers/UpdateUserCredentials.js'
import { DeleteUserCredentialController } from './http/controllers/DeleteUserCredentialController.js'

const userRepository = new MongoUserRepository()

const userCreator = new UserCreator(userRepository)
const userListFinder = new UserFinder(userRepository)
const userLogin = new UserLogin(userRepository)

const createUserController = new CreateUserController(userCreator, vaultCreator)
const findUsersController = new FindUserController(userListFinder)
const loginController = new LoginController(userLogin)
const findUserVaultsController = new FindUserVaultsController(vaultFinder)
const updateUserCredentials = new UpdateUserCredentials(vaultCredentialUpdater)
const deleteUserCredentialController = new DeleteUserCredentialController(vaultCredentialEraser)

export {
  createUserController,
  findUsersController,
  loginController,
  findUserVaultsController,
  updateUserCredentials,
  deleteUserCredentialController
}
