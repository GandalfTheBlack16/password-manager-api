import express from 'express'
import { deleteUserController, availableUsersController, changeUserPasswordController, updateUserController } from '../dependencies.js'

const userRouter = express.Router()

userRouter.get('/available', availableUsersController.handleRequest.bind(availableUsersController))

userRouter.delete('/', deleteUserController.handleRequest.bind(deleteUserController))

userRouter.patch('/:userId', updateUserController.handleRequest.bind(updateUserController))

userRouter.put('/password', changeUserPasswordController.handleRequest.bind(changeUserPasswordController))

export { userRouter }
