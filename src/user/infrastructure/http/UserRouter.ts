import express from 'express'
import { findUsersController } from '../dependencies.js'

const userRouter = express.Router()

userRouter.get('/', findUsersController.handleRequest.bind(findUsersController))

export { userRouter }
