import { UserCreator } from '../application/UserCreator.js'
import { CreateUserController } from './http/controllers/CreateUserController.js'
import { MongoUserRepository } from './db/repositories/MongoUserRepository.js'

const userRepository = new MongoUserRepository()

const userCreator = new UserCreator(userRepository)

export const createUserController = new CreateUserController(userCreator)
