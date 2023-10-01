import express from 'express'
import { createUserController, findUsersController, loginController } from '../dependencies.js'

const userRouter = express.Router()

userRouter.get('/', findUsersController.handleRequest.bind(findUsersController))

userRouter.post('/', createUserController.handleRequest.bind(createUserController))

userRouter.post('/login', loginController.handleRequest.bind(loginController))

export { userRouter }
