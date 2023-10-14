import express from 'express'
import { deleteUserController, findUsersController } from '../dependencies.js'

const userRouter = express.Router()

userRouter.get('/', findUsersController.handleRequest.bind(findUsersController))

userRouter.delete('/', deleteUserController.handleRequest.bind(deleteUserController))

export { userRouter }
