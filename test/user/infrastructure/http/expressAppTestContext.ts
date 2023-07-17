import express from 'express'

import { CreateUserController } from '../../../../src/user/infrastructure/http/controllers/CreateUserController.js'
import { FindUserController } from '../../../../src/user/infrastructure/http/controllers/FindUsersController.js'
import { UserFinder } from '../../../../src/user/application/UserFinder.js'
import { UserRepositoryStub } from '../../application/resources/userRepositoryStub.js'
import { UserCreator } from '../../../../src/user/application/UserCreator.js'

const app = express()

const userRouter = express.Router()

const userRepository = new UserRepositoryStub()

const userFinder = new UserFinder(userRepository)
const userCreator = new UserCreator(userRepository)

const findUsersController = new FindUserController(userFinder)
const createUserController = new CreateUserController(userCreator)

userRouter.get('/', findUsersController.handleRequest.bind(findUsersController))

userRouter.post('/', createUserController.handleRequest.bind(createUserController))

app.use(express.json())

app.use('/api/user', userRouter)

export {
  app,
  userRepository
}
