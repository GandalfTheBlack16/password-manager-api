import express from 'express'
import { deleteUserController, findUsersController, changeUserPasswordController } from '../dependencies.js'

const userRouter = express.Router()

userRouter.get('/', findUsersController.handleRequest.bind(findUsersController))

userRouter.delete('/', deleteUserController.handleRequest.bind(deleteUserController))

userRouter.put('/password', changeUserPasswordController.handleRequest.bind(changeUserPasswordController))

export { userRouter }
