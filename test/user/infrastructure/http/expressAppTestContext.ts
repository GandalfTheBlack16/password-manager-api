import express from 'express'

import { CreateUserController } from '../../../../src/user/infrastructure/http/controllers/CreateUserController.js'
import { AvailableUserController } from '../../../../src/user/infrastructure/http/controllers/AvailableUsersController.js'
import { UserFinder } from '../../../../src/user/application/UserFinder.js'
import { UserRepositoryStub } from '../../application/resources/userRepositoryStub.js'
import { UserCreator } from '../../../../src/user/application/UserCreator.js'
import { VaultCreator } from '../../../../src/vault/application/VaultCreator.js'
import { VaultRepository } from '../../../../src/vault/domain/repositories/VaultRepository';
import { VaultRepositoryStub } from '../../../vault/application/resources/vaultRepositoryStub';

function initContext () {
  const app = express()

  const userRouter = express.Router()

  const userRepository = new UserRepositoryStub()
  const vaultRepository = new VaultRepositoryStub()

  const userFinder = new UserFinder(userRepository)
  const userCreator = new UserCreator(userRepository)
  const vaultCreator = new VaultCreator(vaultRepository)

  const availableUserController = new AvailableUserController(userFinder)
  const createUserController = new CreateUserController(userCreator, vaultCreator)

  userRouter.get('/available', availableUserController.handleRequest.bind(availableUserController))

  userRouter.post('/', createUserController.handleRequest.bind(createUserController))

  app.use(express.json())

  app.use('/api/user', userRouter)

  return {
    app,
    userRepository,
    vaultCreator
  }
}

export {
  initContext
}
