import express from 'express'
import { createUserController } from '../dependencies.js'

const userRouter = express.Router()

userRouter.post('/', createUserController.handleRequest.bind(createUserController))

export { userRouter }
