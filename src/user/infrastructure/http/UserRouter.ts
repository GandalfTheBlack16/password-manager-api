import express from 'express'
import { createUserController, findUsersController } from '../dependencies.js'

const userRouter = express.Router()

userRouter.get('/', findUsersController.handleRequest.bind(findUsersController))

userRouter.post('/', createUserController.handleRequest.bind(createUserController))

export { userRouter }
