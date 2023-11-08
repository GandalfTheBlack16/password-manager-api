import express from 'express'
import { deleteUserController, findUsersController, changeUserPasswordController, updateUserController } from '../dependencies.js'

const userRouter = express.Router()

userRouter.get('/available', findUsersController.handleRequest.bind(findUsersController))

userRouter.delete('/', deleteUserController.handleRequest.bind(deleteUserController))

userRouter.patch('/:userId', updateUserController.handleRequest.bind(updateUserController))

userRouter.put('/password', changeUserPasswordController.handleRequest.bind(changeUserPasswordController))

export { userRouter }
